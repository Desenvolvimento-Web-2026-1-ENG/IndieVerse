# Documentação de APIs RESTful com Swagger e OpenAPI — IndieVerse

## 1. Visão Geral do Sistema

A **IndieVerse** é um marketplace simplificado focado em jogos independentes (*indie games*). A plataforma gerencia o ciclo de vida de cadastro de jogos por desenvolvedores/estúdios, navegação por categorias, fluxo de carrinho de compras, conversão em licenças digitais na biblioteca pessoal do jogador e sistema de avaliações (*reviews*) pós-compra.

### Perfis da Plataforma
* **Desenvolvedor:** Estúdios e desenvolvedores independentes que gerenciam seus perfis e cadastram jogos com especificações técnicas (categoria, preço e requisitos mínimos).
* **Jogador:** Usuários da plataforma que gerenciam seu perfil, adicionam títulos ao carrinho de compras, realizam checkout para gerar licenças na biblioteca pessoal e avaliam os jogos adquiridos.

---

## 2. Padrão Arquitetural (Clean Architecture)

A documentação segue os princípios da Arquitetura Limpa, onde a interface e especificações de rede pertencem exclusivamente à **camada de Infraestrutura**:

* **Domínio e Casos de Uso:** Entidades (`Jogo`, `Jogador`, `Desenvolvedor`, `Categoria`, `ItemCarrinho`, `Licenca`, `Avaliacao`) e Contratos de Repositórios permanecem livres de dependências de rotas ou bibliotecas externas.
* **Infraestrutura HTTP:** A especificação OpenAPI e anotações `@swagger` ficam isoladas nas rotas HTTP em `src/infrastructure/http/routes/` e no configurador centralizado em `src/infrastructure/http/docs/swagger.ts`.

---

## 3. Estrutura das Rotas da API (`/api/v1`)

| Categoria | Método | Rota | Descrição |
| :--- | :--- | :--- | :--- |
| **Jogadores** | `POST` | `/api/v1/jogadores` | Cadastra um novo jogador na plataforma |
| **Jogadores** | `GET` | `/api/v1/jogadores` | Lista todos os jogadores cadastrados |
| **Jogadores** | `GET` | `/api/v1/jogadores/:id` | Busca perfil do jogador por ID |
| **Jogadores** | `PUT` | `/api/v1/jogadores/:id` | Atualiza dados do perfil do jogador |
| **Jogadores** | `DELETE` | `/api/v1/jogadores/:id` | Remove um jogador da plataforma |
| **Desenvolvedores** | `POST` | `/api/v1/desenvolvedores` | Cadastra um novo desenvolvedor/estúdio |
| **Desenvolvedores** | `GET` | `/api/v1/desenvolvedores` | Lista todos os desenvolvedores cadastrados |
| **Desenvolvedores** | `GET` | `/api/v1/desenvolvedores/:id` | Busca perfil do desenvolvedor por ID |
| **Desenvolvedores** | `PUT` | `/api/v1/desenvolvedores/:id` | Atualiza perfil do desenvolvedor |
| **Desenvolvedores** | `DELETE` | `/api/v1/desenvolvedores/:id` | Remove um desenvolvedor da plataforma |
| **Categorias** | `GET` | `/api/v1/categorias` | Lista as categorias de jogos disponíveis |
| **Categorias** | `POST` | `/api/v1/categorias` | Cadastra uma nova categoria de jogo |
| **Categorias** | `GET` | `/api/v1/categorias/:id` | Busca detalhes de uma categoria por ID |
| **Categorias** | `PUT` | `/api/v1/categorias/:id` | Atualiza o nome de uma categoria por ID |
| **Categorias** | `DELETE` | `/api/v1/categorias/:id` | Deleta uma categoria por ID |
| **Jogos** | `POST` | `/api/v1/jogos` | Cadastra um novo jogo (vincular ao `desenvolvedorId`) |
| **Jogos** | `GET` | `/api/v1/jogos` | Lista todos os jogos independentes cadastrados na vitrine |
| **Jogos** | `GET` | `/api/v1/jogos/:id` | Busca detalhes completos de um jogo pelo ID |
| **Carrinho e Checkout** | `POST` | `/api/v1/carrinho` | Adiciona um jogo ao carrinho de um jogador |
| **Carrinho e Checkout** | `GET` | `/api/v1/carrinho/:jogadorId` | Lista os itens contidos no carrinho do jogador |
| **Carrinho e Checkout** | `DELETE` | `/api/v1/carrinho/:jogadorId/item/:jogoId` | Remove um item específico do carrinho antes do checkout |
| **Carrinho e Checkout** | `PUT` | `/api/v1/carrinho/:jogadorId/checkout` | Altera status do carrinho para FINALIZADO, gera licenças e zera o carrinho |
| **Biblioteca Pessoal** | `GET` | `/api/v1/biblioteca/:jogadorId` | Lista todas as licenças de jogos adquiridas pelo jogador |
| **Avaliações** | `POST` | `/api/v1/avaliacoes` | Registra uma avaliação/review (valida permissão pós-compra) |
| **Avaliações** | `GET` | `/api/v1/avaliacoes/jogo/:jogoId` | Lista todas as avaliações publicadas de um jogo |

---

## 4. Modelos de Dados e Payload (JSON)

### 4.1. Cadastro de Jogo (`POST /api/v1/jogos`)
```json
{
  "titulo": "Cat's Cafeteria",
  "descricao": "Um jogo aconchegante de gerenciamento de cafeteria de gatos.",
  "preco": 24.90,
  "desenvolvedorId": 1,
  "categoriaId": 1,
  "requisitosMinimos": {
    "so": "Windows 10",
    "processador": "Intel Core i3",
    "memoriaRam": "4GB",
    "placaVideo": "GTX 750",
    "armazenamento": "2GB"
  }
}
```

### 4.2. Checkout (`PUT /api/v1/carrinho/checkout`)
```json
{
  "jogadorId": 1
}
```

### 4.3. Avaliação Pós-Compra (POST /api/v1/avaliacoes)
```json
{
  "jogadorId": 1,
  "jogoId": 1,
  "nota": 5,
  "comentario": "Excelente jogo! Recomendadíssimo."
}
```

### 4.4. Respostas de Sucesso e Erros Espetados

#### Sucesso — Checkout Realizado (`200 OK`)
```json
{
  "mensagem": "Checkout realizado com sucesso! Carrinho finalizado e zerado.",
  "carrinho": {
    "id": 1,
    "jogadorId": 1,
    "status": "FINALIZADO",
    "itens": []
  },
  "licencas": [
    {
      "id": 1,
      "jogadorId": 1,
      "jogoId": 1,
      "dataAquisicao": "2026-08-23T16:00:00.000Z"
    }
  ]
}
```

#### Erro — Tentativa de Avaliar Jogo Sem Licença (403 Forbidden)
```json
{
  "mensagem": "Você só pode avaliar jogos que comprou e estão em sua biblioteca."
}
```

#### Erro — Recurso Não Encontrado (404 Not Found)
```json
{
  "mensagem": "Jogo não encontrado."
}
```

#### Erro — Campos Obrigatórios Ausentes (400 Bad Request)
```json
{
  "mensagem": "Nome do Estúdio e Email são obrigatórios."
}
```

## 5. Endpoints de Documentação no Servidor
Após iniciar a aplicação (npm run dev), a documentação interativa e os artefatos de integração estarão acessíveis através dos seguintes caminhos HTTP:

- Swagger UI (Interface Interativa): http://localhost:8080/api-docs

- Especificação JSON (Importação no Postman): http://localhost:8080/api-docs-json

## 6. Como Executar o Projeto Localmente

1. Clone o repositório:
   git clone <URL_DO_REPOSITORIO>

2. Instale as dependências:
   npm install

3. Inicie o servidor em modo de desenvolvimento:
   npm run dev

4. Acesse a documentação no navegador:
   http://localhost:8080/api-docs


### Autor

- [@PHCordeiro](https://www.github.com/octokatherine)