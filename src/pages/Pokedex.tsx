import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPerfilAtivo, lerEquipe } from '../perfis';

const SEM_FOTO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='%23f1f5f9'/><text x='60' y='72' font-size='48' text-anchor='middle'>❓</text></svg>";

const idDaUrl = (url: string) => {
  const partes = url.split('/');
  return partes[partes.length - 2];
};

export default function Pokedex() {
  const [todosPokemons, setTodosPokemons] = useState<any[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [limite, setLimite] = useState(40);

  // Pokémon que já estão na equipe do perfil ativo
  const idsNaEquipe = useMemo(() => {
    const perfil = getPerfilAtivo();
    return new Set(perfil ? lerEquipe(perfil.id).map((m) => String(m.id)) : []);
  }, []);

  useEffect(() => {
    const carregarBaseDeDados = async () => {
      setLoading(true);
      try {
        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        if (!resposta.ok) throw new Error('Falha na ligação ao PC do Bill.');
        const dados = await resposta.json();
        setTodosPokemons(dados.results);
      } catch (err) {
        setErro('Falha ao acessar a base de dados da PokéAPI.');
      } finally {
        setLoading(false);
      }
    };
    carregarBaseDeDados();
  }, []);

  const lidarComBusca = (valor: string) => {
    setTermoBusca(valor);
    setLimite(40);
  };

  const sortearEncontro = () => {
    if (todosPokemons.length > 0) {
      const indexAleatorio = Math.floor(Math.random() * todosPokemons.length);
      lidarComBusca(todosPokemons[indexAleatorio].name);
    }
  };

  const termo = termoBusca.trim().toLowerCase();
  const pokemonsFiltrados = termo
    ? todosPokemons.filter((p) => p.name.includes(termo) || idDaUrl(p.url) === termo)
    : todosPokemons;

  const pokemonsVisiveis = pokemonsFiltrados.slice(0, limite);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Pokédex Nacional 📖</h2>
      <p>Explorando a base de dados de 1025 espécies. Digite um nome ou número para filtrar na hora!</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => lidarComBusca(e.target.value)}
          placeholder="Ex: greninja, lucario, 151..."
          style={{ padding: '0.75rem', flex: 1, minWidth: '200px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
        />

        <button onClick={sortearEncontro} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          🎲 Sorteio rápido
        </button>

        <button onClick={() => lidarComBusca('')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Limpar
        </button>
      </div>

      {!loading && !erro && (
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Mostrando {pokemonsVisiveis.length} de {pokemonsFiltrados.length} Pokémon
        </p>
      )}

      {loading && <h3 style={{ textAlign: 'center', color: '#ef4444' }}>Conectando aos satélites da Liga Pokémon... 🛰️</h3>}
      {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}

      {!loading && !erro && pokemonsFiltrados.length === 0 && (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.2rem' }}>Nenhum Pokémon encontrado. Confira o nome ou o número.</p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
        {pokemonsVisiveis.map((poke) => {
          const id = idDaUrl(poke.url);
          const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          const naEquipe = idsNaEquipe.has(id);

          return (
            <div key={id} style={{ backgroundColor: 'white', border: naEquipe ? '2px solid #ef4444' : '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', width: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Nº {id}</span>
                {naEquipe && <span style={{ fontSize: '0.7rem', backgroundColor: '#ef4444', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>Na equipe</span>}
              </div>
              <img
                src={imagem}
                alt={poke.name}
                loading="lazy"
                style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = SEM_FOTO; }}
              />
              <h4 style={{ textTransform: 'capitalize', margin: '0.5rem 0 1rem 0' }}>{poke.name}</h4>
              <Link
                to={`/pokemon/${id}`}
                style={{ marginTop: 'auto', padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#334155', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
              >
                Ver status
              </Link>
            </div>
          );
        })}
      </div>

      {!loading && pokemonsFiltrados.length > limite && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <button
            onClick={() => setLimite(limite + 40)}
            style={{ padding: '1rem 3rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)' }}
          >
            ➕ Carregar mais Pokémon
          </button>
        </div>
      )}
    </div>
  );
}
