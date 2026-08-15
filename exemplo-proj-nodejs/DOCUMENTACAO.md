# Documentação de APIs RESTful com Swagger e OpenAPI

## 1. O que é e por que documentar?

Uma API só é verdadeiramente útil se os desenvolvedores (front-end, mobile ou terceiros) souberem como consumi-la. A documentação serve como o "manual de instruções" do seu *back-end*, especificando quais rotas existem, quais dados devem ser enviados e o que será retornado.

O padrão de mercado para documentação de APIs RESTful é a **OpenAPI Specification (OAS)**, frequentemente implementada através da ferramenta **Swagger**. O Swagger não apenas descreve a API visualmente, mas também cria uma interface interativa onde é possível testar as rotas diretamente pelo navegador.

---

## 2. Documentação na Clean Architecture

Um dos princípios fundamentais da Arquitetura Limpa (Clean Architecture) é a separação de responsabilidades. Onde a documentação deve ficar?

**A documentação é um detalhe de Infraestrutura.** 

Nossas Entidades, Casos de Uso (Services) e Controladores não devem saber que o Swagger existe. Não devemos poluir o "coração" da nossa aplicação com anotações de documentação. Por isso, os arquivos do Swagger devem ficar isolados dentro da camada de rede, especificamente em `src/infrastructure/http/`.

---

## 3. Implementação Prática com Express e TypeScript

### 3.1. Instalação das Dependências
Para integrar a interface visual do Swagger ao Express, utilizamos a biblioteca `swagger-ui-express`.

```bash
npm install swagger-ui-express
npm install -D @types/swagger-ui-express
```

### 3.2. Criando o Arquivo de Especificação
Dentro de `src/infrastructure/http/docs/`, criamos o arquivo `swagger.ts`. 

**Boa Prática de Mercado:** Nunca faça *hardcode* (valores fixos) da URL ou porta do servidor. Quando a API for para a nuvem, a porta mudará dinamicamente. Utilizamos variáveis de ambiente (`process.env`) para garantir que a documentação se adapte ao ambiente onde está rodando.

```typescript
// src/infrastructure/http/docs/swagger.ts

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}/api/v1`;

export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API de Gestão de Tarefas',
        version: '1.0.0',
        description: 'Documentação oficial da API estruturada em Clean Architecture.'
    },
    servers: [
        { 
            url: BASE_URL, 
            description: 'Servidor da API' 
        }
    ],
    paths: {
        '/tarefas': {
            get: {
                summary: 'Lista todas as tarefas',
                tags: ['Tarefas'],
                responses: {
                    '200': {
                        description: 'Sucesso'
                    }
                }
            },
            post: {
                summary: 'Cria uma nova tarefa',
                tags: ['Tarefas'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CriarTarefaDTO'
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Criado com sucesso' },
                    '400': { description: 'Dados inválidos' }
                }
            }
        }
    },
    components: {
        schemas: {
            CriarTarefaDTO: {
                type: 'object',
                required: ['titulo'],
                properties: {
                    titulo: { type: 'string' },
                    descricao: { type: 'string' }
                }
            }
        }
    }
};
```

### 3.3. Acoplando ao Servidor Express
No ponto de entrada da nossa infraestrutura web (`server.ts`), importamos a biblioteca do Swagger e a nossa especificação para criar uma rota dedicada à documentação, geralmente `/api-docs`.

```typescript
// src/infrastructure/http/server.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import tarefasRoutes from './routes/tarefas.routes';
import { swaggerDocument } from './docs/swagger';

const app = express();

app.use(express.json());

// Expondo a rota da documentação visual
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Nossas rotas de negócio
app.use('/api', tarefasRoutes);

// Consumindo a mesma porta dinâmica definida para o Swagger
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n✅ Servidor rodando na porta ${PORT}`);
    console.log(`📄 Documentação interativa em: http://localhost:${PORT}/api-docs`);
});
```

---

## 4. Testando as Variáveis de Ambiente

Para verificar se a parametrização dinâmica da porta está funcionando, os desenvolvedores podem injetar as variáveis diretamente pelo terminal ao iniciar o projeto:

**No Linux, Mac ou Codespaces:**
```bash
PORT=8080 BASE_URL=http://localhost:8080/api/v1 npm run dev
```

Ao fazer isso, o servidor iniciará na porta `8080`. Ao acessar `http://localhost:8080/api-docs`, você verá que a URL base de testes (o botão "Try it out") dentro do próprio Swagger também foi atualizada automaticamente, provando que a documentação está pronta para qualquer ambiente de produção.