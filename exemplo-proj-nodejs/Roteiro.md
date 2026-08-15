# Evolução de APIs Node.js – Do Módulo HTTP à Arquitetura Limpa com TypeScript

## 1. Introdução: A Transição do Módulo HTTP para o Express.js

No início do desenvolvimento com Node.js, utilizamos o módulo nativo `http`. Embora poderoso, ele exige que o desenvolvedor resolva manualmente problemas básicos, como o roteamento (através de extensos blocos `if/else` ou `switch`) e a manipulação de fluxos de dados (*streams*) para converter JSON.

O **Express.js** é um *framework* minimalista que abstrai essas complexidades. Ele introduz conceitos fundamentais como:
*   **Roteamento Semântico:** Uso direto de métodos como `app.get()`, `app.post()`, facilitando a leitura e manutenção.
*   **Middlewares:** Interceptadores de requisição que podem, com uma única linha (ex: `app.use(express.json())`), resolver a conversão de corpo de requisições.
*   **Foco na Lógica:** O desenvolvedor para de escrever código de infraestrutura de rede e passa a focar nas regras de negócio.

---

## 2. A Adoção do TypeScript: Segurança e Produtividade

O JavaScript padrão permite que variáveis mudem de tipo e que objetos recebam propriedades inexistentes sem avisos prévios, gerando erros apenas em tempo de execução (*runtime*). 

O **TypeScript** resolve isso adicionando tipagem estática. Ao definirmos `interfaces` (contratos de dados), o editor de código (como o VS Code) fornece autocompletar inteligente e bloqueia erros de digitação antes mesmo de o código ser executado.

### 2.1. Ferramental Moderno: O uso do `tsx`
Historicamente, utilizava-se bibliotecas como `ts-node` ou `ts-node-dev`. No entanto, em versões modernas do Node.js, o padrão de mercado migrou para o **`tsx`** (TypeScript Execute). 
*   **Velocidade:** O `tsx` utiliza o motor `esbuild` por baixo dos panos, o que o torna incrivelmente rápido.
*   **Execução Direta:** Ele remove as tipagens e executa o JavaScript imediatamente, sem realizar validações lentas de tipo no terminal.
*   **O papel do `tsconfig.json`:** Mesmo usando o `tsx`, o arquivo `tsconfig.json` continua sendo obrigatório. É ele que calibra o VS Code para apontar erros (a famosa "linha vermelha") e permite o uso de recursos avançados, como *Path Aliases*.

---

## 3. Arquitetura de Software: Rumo à Clean Architecture

À medida que o projeto cresce, colocar todas as rotas e lógicas de banco de dados em um único arquivo `server.ts` cria um sistema frágil, difícil de testar e impossível de manter. Para resolver isso, aplicamos princípios da **Clean Architecture** (Arquitetura Limpa) e do **SOLID** (especialmente a Inversão de Dependência).

O objetivo principal é separar o código em **camadas de responsabilidade**, onde o núcleo da aplicação (regras de negócio) não saiba absolutamente nada sobre detalhes externos (como o Express ou o Banco de Dados).

### 3.1. Visão Geral das Camadas

A estrutura ideal do nosso projeto é dividida da seguinte forma:

```text
src/
├── entities/
├── repositories/
├── services/
├── interfaces/
├── factories/
└── infrastructure/
```

#### A. Entidades (`entities`)
Representam os modelos puros do sistema. Não contêm lógica de framework.
```typescript
export interface Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
}
```

#### B. Repositórios (`repositories`)
Aqui aplicamos a **Inversão de Dependência**. Criamos apenas um *contrato* (Interface) que diz *o que* o banco de dados deve fazer, mas não *como*. A camada de serviço conversará apenas com este contrato.
```typescript
export interface ITarefaRepository {
    listarTodas(): Tarefa[];
    criar(tarefa: Omit<Tarefa, 'id'>): Tarefa;
}
```

#### C. Serviços e Casos de Uso (`services`)
Onde moram as regras de negócio. O serviço recebe os dados, executa validações e orquestra o repositório. Para organizar a entrada de dados, utilizamos **DTOs (Data Transfer Objects)**.
```typescript
// DTO de entrada
export interface CriarTarefaDTO {
    titulo: string;
}

export class TarefaService {
    // Injeção de Dependência: O serviço recebe o repositório pronto
    constructor(private repository: ITarefaRepository) {}

    criar(dados: CriarTarefaDTO): Tarefa {
        return this.repository.criar({ titulo: dados.titulo, concluida: false });
    }
}
```

#### D. Controladores (`interfaces/controllers`)
Fazem a fronteira entre a requisição web e a nossa regra de negócio. O Controlador recebe o `req` e `res` do Express, extrai as informações do corpo da requisição, repassa para o *Service* e devolve o *Status Code* HTTP apropriado (ex: `201 Created`, `404 Not Found`).

#### E. Infraestrutura (`infrastructure`)
A camada mais externa. É a "borda" do sistema que toca o mundo real.
*   **Database:** Onde escrevemos a implementação real do repositório (ex: `TarefaRepositoryInMemory` ou integração com Prisma ORM/SQLite).
*   **HTTP:** Onde configuramos as rotas (`router.post('/tarefas', ...)`) e a inicialização do Express (`server.ts`). Se um dia o Express for trocado, apenas esta pasta sofre alterações.

#### F. Factories (`factories`)
Implementação do padrão **Composition Root**. É o local centralizado responsável por fabricar e conectar as dependências da aplicação. A Factory instancia o repositório da infraestrutura, injeta-o no serviço, instancia o controlador injetando o serviço, e devolve o controlador pronto para a rota usar.

---

## 4. Configurações Avançadas: Path Aliases

Para evitar importações relativas longas e confusas (ex: `import { TarefaService } from '../../../../services/TarefaService'`), utilizamos *Path Aliases* configurados no TypeScript.

No TypeScript moderno, a configuração de rotas no `tsconfig.json` exige o uso de caminhos relativos começando com `./` na propriedade `paths`, dispensando o antigo `baseUrl`.

**Configuração no `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2022",
    "esModuleInterop": true,
    "strict": true,
    "paths": {
      "@entities/*": ["./src/entities/*"],
      "@services/*": ["./src/services/*"],
      "@repositories/*": ["./src/repositories/*"],
      "@interfaces/*": ["./src/interfaces/*"],
      "@infrastructure/*": ["./src/infrastructure/*"],
      "@factories/*": ["./src/factories/*"]
    }
  }
}
```

**Uso prático no código:**
```typescript
// Importação limpa e independente da profundidade da pasta atual
import { TarefaController } from '@interfaces/controllers/TarefaController';
import { TarefaService } from '@services/TarefaService';
```

---

## 5. Build para Produção (Resolvendo o problema dos Aliases)

Quando usamos o comando de desenvolvimento (`npm run dev`), a ferramenta **`tsx`** lê o `tsconfig.json` e resolve os *Path Aliases* dinamicamente em memória. 

Porém, ao realizar o *build* de produção utilizando apenas o compilador nativo (`tsc`), o código é convertido para JavaScript, mas **mantém os aliases intactos** (ex: `require('@services/...')`). Como o Node.js nativo não entende esses mapeamentos, a aplicação quebra ao tentar rodar a versão compilada na pasta `dist`.

Para solucionar isso, a prática padrão de mercado é a utilização do pacote `tsc-alias`.

### 5.1. Configurando os Scripts de Build

1. **Instalação do pacote auxiliar:**
```bash
npm install -D tsc-alias
```

2. **Ajuste no `package.json`:**
Adicionamos os scripts de compilação e inicialização em produção:

```json
"scripts": {
  "dev": "tsx watch src/infrastructure/http/server.ts",
  "build": "tsc && tsc-alias",
  "start": "node dist/infrastructure/http/server.js"
}
```

**Como funciona o pipeline:**
*   **`tsc`**: O compilador nativo do TypeScript varre o código, aponta erros (se existirem) e gera o JavaScript puro dentro da pasta `dist`.
*   **`tsc-alias`**: Roda imediatamente após o `tsc`. Ele lê os arquivos gerados no `dist` e substitui todos os "aliases bonitos" pelos caminhos relativos complexos que o Node.js exige (ex: `../../../services/...`).
*   **`start`**: Executa o servidor em modo de produção utilizando diretamente o Node nativo focado em performance.

---

## 6. Conclusão

Ao longo desta arquitetura, isolamos as responsabilidades. O Express e o TypeScript são apenas ferramentas de entrega e validação. Ao manter as regras de negócio no centro (`Entities` e `Services`) e empurrar os detalhes para as bordas (`Infrastructure`), construímos um software preparado para crescer, receber novos bancos de dados ou trocar de frameworks web com o mínimo de atrito.