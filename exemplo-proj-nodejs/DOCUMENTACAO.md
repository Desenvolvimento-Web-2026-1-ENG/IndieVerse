# Documentação de APIs RESTful com Swagger e OpenAPI — Pocket Store

## 1. O que é e por que documentar?

Uma API só é verdadeiramente útil se os desenvolvedores (front-end, mobile ou terceiros) souberem como consumi-la. A documentação serve como o "manual de instruções" do seu *back-end*, especificando quais rotas existem, quais dados devem ser enviados e o que será retornado.

O padrão de mercado para documentação de APIs RESTful é a **OpenAPI Specification (OAS)**, frequentemente implementada através da ferramenta **Swagger**. O Swagger não apenas descreve a API visualmente, mas também cria uma interface interativa onde é possível testar as rotas diretamente pelo navegador.

---

## 2. Documentação na Clean Architecture

Um dos princípios fundamentais da Arquitetura Limpa (Clean Architecture) é a separação de responsabilidades. Onde a documentação deve ficar?

**A documentação é um detalhe de Infraestrutura.**

Nossas Entidades (`Jogo`, `Categoria`, `Licenca`, `ItemCarrinho`, `Avaliacao`), Repositórios In-Memory e Controladores não devem saber que o Swagger existe. Não devemos poluir o "coração" da nossa aplicação com anotações de documentação. Por isso, os arquivos do Swagger ficam isolados dentro da camada de rede e infraestrutura HTTP em `src/infrastructure/http/docs/`.

---

## 3. Visão Geral da API Pocket Store

A **Pocket Store** é um marketplace simplificado para desenvolvedores independentes listarem seus jogos e para jogadores adquirirem licenças de uso.

### Perfis do Sistema
* **Desenvolvedor:** Cadastra jogos, define preços, categorias e requisitos mínimos.
* **Jogador:** Adiciona jogos ao carrinho, realiza checkout, visualiza sua biblioteca pessoal (licenças adquiridas) e envia avaliações pós-compra.

---

## 4. Implementação Prática com Express e TypeScript

### 4.1. Instalação das Dependências
Para integrar a interface visual do Swagger ao Express, utilizamos as bibliotecas `swagger-ui-express` e `swagger-jsdoc`.

```bash
npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc