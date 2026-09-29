# Pokemon Team Builder

## Integrantes
* Ian Vieira Corrêa
* João Antonio Ferreira da Matta
* Ryann Flávyo Alves Honorato Lessa
* Pietro Herrera Vasconcellos de Almeida

## Motivação e Objetivo
Esta aplicação web foi desenvolvida como a primeira entrega técnica de frontend da disciplina. O tema de criar um construtor de equipes Pokémon foi escolhido simplesmente porque o grupo achou o assunto interessante e divertido de se desenvolver na prática. O sistema permite criar perfis, explorar a base de dados oficial da PokéAPI e montar equipes customizadas.

## Funcionalidades Principais
* **Gestão de Perfis:** Sistema de contas locais (usando localStorage) onde cada treinador possui seu próprio avatar, nome, senha (opcional) e uma equipe totalmente independente.
* **Pokédex Nacional:** Consumo da PokéAPI trazendo os 1025 Pokémon com carregamento otimizado (paginação manual através de limites), sorteio aleatório e filtro de pesquisa instantânea por nome ou número.
* **Validações e Regras:** Limite rigoroso de 6 Pokémon por equipe, com prevenção de entradas duplicadas e feedback visual indicando os slots preenchidos ou vazios.
* **Organização da Equipe:** A página da equipe permite não só remover os Pokémon, mas também reordená-los (mover para a esquerda ou direita) de forma dinâmica.
* **Interface:** Design limpo e adaptado ao tema, com tratamento visual de erros e estados de carregamento.

## Tecnologias e Decisões Arquiteturais
Para manter a aplicação leve e demonstrar o domínio das ferramentas web nativas, optamos por minimizar ao máximo o uso de bibliotecas de terceiros:
* **React + Vite:** Framework principal e bundler de alta performance.
* **TypeScript:** Tipagem forte para prevenção de erros estruturais durante o desenvolvimento.
* **React Router DOM:** A única dependência externa instalada, essencial para a gestão de rotas e navegação fluida no modelo SPA (Single Page Application).
* **Fetch API Nativa:** Consumo assíncrono da PokéAPI feito através do JavaScript puro, dispensando a instalação de clientes HTTP externos como o axios.
* **LocalStorage Nativo:** A persistência de dados e a gestão do estado complexo dos perfis foram implementadas de forma nativa no navegador.
* **CSS in JS (Inline):** Toda a estilização e responsividade foram construídas do zero, garantindo controle sobre a interface sem depender de frameworks como Bootstrap ou Tailwind.

## Instruções de Instalação e Execução

Para rodar a aplicação na sua máquina local, siga o passo a passo abaixo:

### Pré-requisitos
* **Node.js:** É necessário ter o Node.js instalado no seu computador. O gerenciador de pacotes npm já vem incluso na instalação padrão.

### Passos para executar
1. Faça o clone deste repositório ou baixe o arquivo ZIP e extraia-o no seu computador.
2. Abra o terminal e navegue até a pasta raiz do projeto.
3. Instale as dependências executando o comando abaixo. Isso fará o download automático do React, Vite e React Router DOM informados no arquivo package.json:
   ```bash
   npm install
