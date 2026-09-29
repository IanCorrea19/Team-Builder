export interface Perfil {
  id: string;
  nome: string;
  avatar: string;
  salt: string;
  senhaHash: string;
  criadoEm: number;
}

export interface Membro {
  id: number;
  nome: string;
  imagem: string;
  tipos: string[];
}

export const AVATARES = ['🔥', '💧', '🍃', '⚡', '🌙', '⭐', '👻', '🐉'];
export const MAX_EQUIPE = 6;

const K_PERFIS = 'perfis';
const K_ATIVO = 'perfilAtivo';

function ler<T>(chave: string, padrao: T): T {
  try {
    const v = localStorage.getItem(chave);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}
const gravar = (chave: string, valor: unknown) => localStorage.setItem(chave, JSON.stringify(valor));

async function gerarHash(senha: string, salt: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + senha));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const novoSalt = () => crypto.randomUUID();

function migrarLegado() {
  const antigo = localStorage.getItem('treinador');
  if (!antigo || localStorage.getItem(K_PERFIS)) return;
  const id = crypto.randomUUID();
  const perfil: Perfil = {
    id, nome: antigo, avatar: localStorage.getItem('avatar') || '🔥',
    salt: '', senhaHash: '', criadoEm: Date.now(),
  };
  gravar(K_PERFIS, [perfil]);
  gravar(`equipe_${id}`, ler(`equipa_${antigo}`, []));
  localStorage.removeItem(`equipa_${antigo}`);
  localStorage.removeItem('treinador');
  localStorage.removeItem('avatar');
}

export function listarPerfis(): Perfil[] {
  migrarLegado();
  return ler<Perfil[]>(K_PERFIS, []);
}

export function getPerfilAtivo(): Perfil | null {
  const id = localStorage.getItem(K_ATIVO);
  return listarPerfis().find((p) => p.id === id) ?? null;
}

const nomeEmUso = (nome: string, ignorarId?: string) =>
  listarPerfis().some((p) => p.id !== ignorarId && p.nome.toLowerCase() === nome.toLowerCase());

export async function cadastrar(nome: string, avatar: string, senha: string): Promise<Perfil> {
  nome = nome.trim();
  if (nome.length < 2) throw new Error('O nome precisa ter pelo menos 2 caracteres.');
  if (senha.length < 4) throw new Error('A senha precisa ter pelo menos 4 caracteres.');
  if (nomeEmUso(nome)) throw new Error('Já existe um perfil com esse nome.');
  const salt = novoSalt();
  const perfil: Perfil = {
    id: crypto.randomUUID(), nome, avatar, salt,
    senhaHash: await gerarHash(senha, salt), criadoEm: Date.now(),
  };
  gravar(K_PERFIS, [...listarPerfis(), perfil]);
  gravar(`equipe_${perfil.id}`, []);
  localStorage.setItem(K_ATIVO, perfil.id);
  return perfil;
}

export async function entrar(id: string, senha: string): Promise<boolean> {
  const perfil = listarPerfis().find((p) => p.id === id);
  if (!perfil) return false;
  if (perfil.senhaHash && (await gerarHash(senha, perfil.salt)) !== perfil.senhaHash) return false;
  localStorage.setItem(K_ATIVO, id);
  return true;
}

export const sair = () => localStorage.removeItem(K_ATIVO);

export async function atualizarPerfil(
  id: string, dados: { nome?: string; avatar?: string; senha?: string }
) {
  const perfis = listarPerfis();
  const perfil = perfis.find((p) => p.id === id);
  if (!perfil) throw new Error('Perfil não encontrado.');
  if (dados.nome !== undefined) {
    const nome = dados.nome.trim();
    if (nome.length < 2) throw new Error('O nome precisa ter pelo menos 2 caracteres.');
    if (nomeEmUso(nome, id)) throw new Error('Já existe um perfil com esse nome.');
    perfil.nome = nome;
  }
  if (dados.avatar) perfil.avatar = dados.avatar;
  if (dados.senha) {
    if (dados.senha.length < 4) throw new Error('A senha precisa ter pelo menos 4 caracteres.');
    perfil.salt = novoSalt();
    perfil.senhaHash = await gerarHash(dados.senha, perfil.salt);
  }
  gravar(K_PERFIS, perfis);
}

export function excluirPerfil(id: string) {
  gravar(K_PERFIS, listarPerfis().filter((p) => p.id !== id));
  localStorage.removeItem(`equipe_${id}`);
  if (localStorage.getItem(K_ATIVO) === id) sair();
}

export const lerEquipe = (id: string) => ler<Membro[]>(`equipe_${id}`, []);
export const salvarEquipe = (id: string, equipe: Membro[]) => gravar(`equipe_${id}`, equipe);
