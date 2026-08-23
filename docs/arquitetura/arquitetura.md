# Diagrama de Classes — IndieVerse

## Classes Principais

---

# Usuário

## Atributos
- id
- nome
- email
- senha
- fotoPerfil
- tipoUsuario

## Métodos
- login()
- logout()
- editarPerfil()

---

# Jogador

## Herda de
Usuário

## Atributos
- biblioteca
- carrinho

## Métodos
- adicionarAoCarrinho()
- comprarJogo()
- avaliarJogo()
- visualizarBiblioteca()

---

# Desenvolvedor

## Herda de
Usuário

## Atributos
- estudio
- jogosPublicados

## Métodos
- publicarJogo()
- editarJogo()
- visualizarMetricas()

---

# Jogo

## Atributos
- id
- titulo
- descricao
- preco
- categoria
- requisitosMinimos
- banner
- notaMedia
- dataLancamento

## Métodos
- calcularNotaMedia()
- atualizarInformacoes()

---

# Review

## Atributos
- id
- nota
- comentario
- dataReview

## Métodos
- editarReview()
- excluirReview()

---

# Carrinho

## Atributos
- id
- valorTotal
- itens

## Métodos
- adicionarJogo()
- removerJogo()
- calcularTotal()

---

# ItemCarrinho

## Atributos
- quantidade
- subtotal

---

# Biblioteca

## Atributos
- id
- jogosAdquiridos

## Métodos
- adicionarJogo()
- removerJogo()

---

# Compra

## Atributos
- id
- dataCompra
- valorTotal
- status

## Métodos
- finalizarCompra()
- gerarComprovante()

---

# Categoria

## Atributos
- id
- nome
- descricao

---

# Relacionamentos

- Usuário é classe pai de Jogador e Desenvolvedor
- Desenvolvedor publica vários Jogos
- Jogador possui uma Biblioteca
- Jogador possui um Carrinho
- Carrinho possui vários ItemCarrinho
- ItemCarrinho referencia um Jogo
- Jogador realiza várias Compras
- Compra possui vários Jogos
- Jogador pode avaliar Jogos através de Reviews
- Jogo pertence a uma Categoria
- Jogo possui várias Reviews

---

# Cardinalidades

- Desenvolvedor 1:N Jogo
- Jogador 1:1 Biblioteca
- Jogador 1:1 Carrinho
- Carrinho 1:N ItemCarrinho
- Jogo 1:N Review
- Jogador 1:N Review
- Compra N:N Jogo
- Biblioteca N:N Jogo
- Categoria 1:N Jogo

