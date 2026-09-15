-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Desenvolvedor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "estudio" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "requisitosMinimos" TEXT,
    "categoriaId" TEXT NOT NULL,
    "desenvolvedorId" TEXT NOT NULL,
    CONSTRAINT "Jogo_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jogo_desenvolvedorId_fkey" FOREIGN KEY ("desenvolvedorId") REFERENCES "Desenvolvedor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Carrinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jogadorId" TEXT NOT NULL,
    "jogoId" TEXT NOT NULL,
    CONSTRAINT "Carrinho_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Carrinho_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Licenca" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jogadorId" TEXT NOT NULL,
    "jogoId" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Licenca_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Licenca_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "jogadorId" TEXT NOT NULL,
    "jogoId" TEXT NOT NULL,
    CONSTRAINT "Avaliacao_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Avaliacao_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Jogador_email_key" ON "Jogador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Desenvolvedor_email_key" ON "Desenvolvedor"("email");
