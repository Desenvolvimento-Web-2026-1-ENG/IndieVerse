# Material de Apoio: Introdução ao Node.js e Ecossistema

Este documento serve como guia prático e teórico para os conceitos fundamentais de desenvolvimento back-end utilizando Node.js. 

---

## 1. O que é o Node.js?

Diferente do que muitos pensam, o Node.js **não é uma linguagem de programação** e **não é um framework**. Ele é um **ambiente de execução** (*runtime*) que permite rodar código JavaScript fora do navegador web, diretamente no sistema operacional (servidor). Ele foi construído em cima da engine V8, a mesma que processa o JavaScript no Google Chrome.

### Características Principais

* **Single-Threaded:** O Node.js opera em uma única thread principal.
* **Non-Blocking I/O (Entrada e Saída não bloqueantes):** Quando o Node precisa fazer uma tarefa demorada (como ler um arquivo ou consultar um banco de dados), ele não trava o servidor. Ele delega a tarefa e continua atendendo outras requisições. Quando a tarefa termina, ele é avisado.
* **Orientado a Eventos:** O mecanismo que gerencia essa fila de tarefas e retornos é chamado de **Event Loop**.

### Comparativo de Uso

| Onde o Node.js Brilha | Onde o Node.js Sofre |
|---|---|
| APIs RESTful e Microsserviços | Processamento pesado de CPU (ex: renderização 3D) |
| Aplicações em Tempo Real (Chat, WebSockets) | Edição e transcodificação de vídeos |
| Streaming de dados | Cálculos matemáticos complexos contínuos |

---

## 2. O Modo Interativo (REPL)

O REPL (Read-Eval-Print Loop) é o console nativo do Node.js direto no seu terminal. Ele lê o que você digita, avalia o código, imprime o resultado e entra em loop esperando o próximo comando. É ideal para testes rápidos.

### Como acessar e sair
* Abra o terminal e digite apenas `node`.
* O prompt mudará para um sinal de maior `>`. Você já pode digitar JavaScript puro.
* Para sair, digite `.exit` ou pressione `Ctrl + C` duas vezes.

### Comandos úteis no REPL
* **Autocompletar:** Digite `[].` e pressione a tecla `TAB` duas vezes para ver todos os métodos de um array.
* **A variável mágica `_`:** O caractere `_` (underline) sempre guarda o resultado da última operação executada.
* **Modo Editor:** Digite `.editor` para abrir um modo que permite colar blocos de código grandes sem quebrar a formatação. Pressione `Ctrl + D` para executar.

---

## 3. JavaScript no Terminal (Exemplos Básicos)

O JavaScript no Node.js é o mesmo do navegador, mas sem os objetos visuais. **Não existem** `window`, `document` ou `alert()`. Em vez disso, temos objetos de sistema como o `process`.

### Exemplo 1: Lógica Padrão e Arrays
Os métodos modernos do JavaScript funcionam perfeitamente. Crie um arquivo `arrays.js` e execute com o comando `node arrays.js`:

```javascript
const alunos = [
  { nome: "Ana", nota: 8.5 },
  { nome: "Carlos", nota: 5.0 },
  { nome: "Beatriz", nota: 9.2 }
];

const aprovados = alunos.filter(aluno => aluno.nota >= 7.0);

console.log("--- Lista de Aprovados ---");
aprovados.forEach(aluno => {
  console.log(`✅ ${aluno.nome} (Nota: ${aluno.nota})`);
});
```

### Exemplo 2: Interagindo com o Terminal (`process.argv`)
Para ler o que o usuário digita no terminal logo após o comando de execução, usamos o array `process.argv`:

```javascript
// O argumento que o usuário digita fica na posição 2 do array
const nome = process.argv[2];

if (!nome) {
  console.log("⚠️ Digite seu nome. Exemplo: node script.js Maria");
} else {
  console.log(`Olá, ${nome}! O Node.js capturou sua entrada.`);
}
```

---

## 4. O Ecossistema: Gerenciadores de Pacotes e npx

Para construir aplicações complexas, utilizamos pacotes de código criados pela comunidade (bibliotecas e frameworks). O Node.js possui um vasto ecossistema de gerenciadores para lidar com essas dependências.

### 4.1. NPM, Yarn e pnpm
Embora o **NPM (Node Package Manager)** venha instalado por padrão com o Node, existem alternativas populares criadas pela comunidade para resolver problemas específicos (como velocidade e espaço em disco):

* **NPM:** O gerenciador oficial e padrão. Amplamente utilizado e testado.
* **Yarn:** Criado pelo Facebook. Introduziu o conceito de cache local poderoso (se você já baixou um pacote antes, ele não baixa da internet de novo, usa o do cache, tornando a instalação muito rápida) e instalações simultâneas.
* **pnpm:** Ganhou muita popularidade recentemente por ser extremamente rápido e eficiente. Ele usa um sistema de *symlinks* (atalhos), garantindo que um mesmo pacote baixado várias vezes em projetos diferentes ocupe espaço no disco apenas uma vez.

**Comandos equivalentes:**
* Inicializar projeto: `npm init -y` | `yarn init -y` | `pnpm init`
* Instalar dependência: `npm install express` | `yarn add express` | `pnpm add express`
* Instalar dependência de Dev: `npm install nodemon -D` | `yarn add nodemon -D` | `pnpm add -D nodemon`

### 4.2. O arquivo package.json
Todo projeto Node.js começa inicializando o gerenciador de pacotes, o que gera o arquivo `package.json`. Ele é a "identidade" do seu projeto, contendo o nome, os scripts de execução (ex: `npm start`) e o catálogo com todas as bibliotecas necessárias para o projeto funcionar (`dependencies` e `devDependencies`).

### 4.3. npx (Node Package Execute)
Enquanto o `npm`, `yarn` e `pnpm` servem para **instalar** pacotes, o `npx` (que vem embutido com o npm) serve para **executar** pacotes.

**Por que o npx é importante?**
No passado, se você quisesse usar uma ferramenta de linha de comando feita em Node (como o gerador de projetos do React), precisava instalá-la globalmente no seu computador (`npm install -g create-react-app`). Isso gerava lixo no sistema e problemas de versão (ficar preso a uma versão antiga).

Com o `npx`, você **não precisa instalar nada globalmente**. Ele baixa a versão mais recente da ferramenta, executa o comando e depois "joga fora". 

*Exemplo de uso:*
```bash
# Executando um pacote sem instalá-lo globalmente
npx cowsay "O npx é incrível!"
```

---

## 5. Módulos Nativos e Manipulação de Arquivos

O Node.js vem com módulos embutidos para interagir com o sistema operacional. Um dos mais usados é o módulo `fs` (File System) para ler e escrever arquivos.

### Exemplo: Leitura de Arquivo Assíncrona
Adicione `"type": "module"` no seu `package.json` para habilitar a sintaxe de `import`.

```javascript
import { promises as fs } from 'fs';

async function lerArquivo() {
  try {
    console.log('1. Iniciando leitura...');
    
    // O await pausa esta função até o arquivo ser lido, liberando o Event Loop
    const dados = await fs.readFile('./mensagem.txt', 'utf-8');
    
    console.log('2. Conteúdo do arquivo:', dados);
  } catch (erro) {
    console.error('Erro ao ler o arquivo:', erro.message);
  }
}

lerArquivo();
console.log('3. O script principal continua rodando...');
```

---

## 6. Criando o Primeiro Servidor HTTP

Antes de usar frameworks como o Express.js, é importante entender como criar um servidor web com o módulo nativo `http`.

Crie um arquivo `servidor.js` e execute-o. Depois, abra o navegador e acesse `http://localhost:3000/api/status`.

OBS.: Adicione `"type": "module"` no seu `package.json` para habilitar a sintaxe de `import`.

```javascript
import http from 'http';

const PORTA = 3000;

const servidor = http.createServer((req, res) => {
  // Configurando o cabeçalho da resposta para retornar JSON
  res.setHeader('Content-Type', 'application/json');

  // Sistema simples de rotas
  if (req.url === '/api/status' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'Online', 
      mensagem: 'Meu primeiro servidor Node.js funciona!' 
    }));
  } else {
    // Tratamento para rota não encontrada (Erro 404)
    res.writeHead(404);
    res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
  }
});

// Iniciando o servidor na porta definida
servidor.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
});
