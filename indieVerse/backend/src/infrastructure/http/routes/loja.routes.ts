import { Router } from "express";
import { CarrinhoRepositoryInMemory } from "@infrastructure/database/CarrinhoRepositoryInMemory";
import { BibliotecaRepositoryInMemory } from "@infrastructure/database/BibliotecaRepositoryInMemory";
import { AvaliacaoRepositoryInMemory } from "@infrastructure/database/AvaliacaoRepositoryInMemory";

const router = Router();
const carrinhoRepository = new CarrinhoRepositoryInMemory();
const bibliotecaRepository = new BibliotecaRepositoryInMemory();
const avaliacaoRepository = new AvaliacaoRepositoryInMemory();

/**
 * @swagger
 * /api/v1/carrinho:
 *   post:
 *     summary: Adiciona um jogo ao carrinho do jogador
 *     tags: [Carrinho e Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jogadorId, jogoId]
 *             properties:
 *               jogadorId:
 *                 type: integer
 *               jogoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item adicionado ao carrinho com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes
 */
router.post("/carrinho", (req, res) => {
  const { jogadorId, jogoId } = req.body;
  if (!jogadorId || !jogoId) {
    return res.status(400).json({ mensagem: "jogadorId e jogoId são obrigatórios." });
  }
  const carrinho = carrinhoRepository.adicionarItem(Number(jogadorId), Number(jogoId));
  return res.status(201).json({ mensagem: "Item adicionado ao carrinho com sucesso.", carrinho });
});

/**
 * @swagger
 * /api/v1/carrinho/{jogadorId}:
 *   get:
 *     summary: Lista o carrinho atual e seus itens pelo ID do jogador
 *     tags: [Carrinho e Checkout]
 *     parameters:
 *       - in: path
 *         name: jogadorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado atual do carrinho obtido com sucesso
 */
router.get("/carrinho/:jogadorId", (req, res) => {
  const { jogadorId } = req.params;
  const carrinho = carrinhoRepository.obterCarrinho(Number(jogadorId));
  return res.status(200).json(carrinho);
});

/**
 * @swagger
 * /api/v1/carrinho/{jogadorId}/item/{jogoId}:
 *   delete:
 *     summary: Remove um item específico do carrinho do jogador
 *     tags: [Carrinho e Checkout]
 *     parameters:
 *       - in: path
 *         name: jogadorId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: jogoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item removido do carrinho com sucesso
 *       404:
 *         description: Item não encontrado no carrinho
 */
router.delete("/carrinho/:jogadorId/item/:jogoId", (req, res) => {
  const jogadorId = Number(req.params.jogadorId);
  const jogoId = Number(req.params.jogoId);

  const removido = carrinhoRepository.removerItem(jogadorId, jogoId);
  if (!removido) {
    return res.status(404).json({ mensagem: "Item não encontrado no carrinho." });
  }

  return res.status(204).send();
});

/**
 * @swagger
 * /api/v1/carrinho/{jogadorId}/checkout:
 *   put:
 *     summary: Atualiza o status do carrinho para FINALIZADO (Checkout), transfere itens para a biblioteca e zera o carrinho
 *     tags: [Carrinho e Checkout]
 *     parameters:
 *       - in: path
 *         name: jogadorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Checkout realizado com sucesso, status alterado para FINALIZADO e carrinho zerado
 *       400:
 *         description: Carrinho está vazio ou não está aberto para checkout
 */
router.put("/carrinho/:jogadorId/checkout", (req, res) => {
  const jogadorId = Number(req.params.jogadorId);

  if (!jogadorId) {
    return res.status(400).json({ mensagem: "jogadorId inválido." });
  }

  const carrinho = carrinhoRepository.obterCarrinho(jogadorId);

  if (carrinho.status !== "ABERTO") {
    return res.status(400).json({ mensagem: `O carrinho atual não está ABERTO (Status atual: ${carrinho.status}).` });
  }

  if (carrinho.itens.length === 0) {
    return res.status(400).json({ mensagem: "O carrinho está vazio." });
  }

  const licencasGeradas = carrinho.itens.map((item) =>
    bibliotecaRepository.adicionarLicenca(item.jogadorId, item.jogoId)
  );

  const carrinhoAtualizado = carrinhoRepository.atualizarStatus(jogadorId, "FINALIZADO");

  return res.status(200).json({
    mensagem: "Checkout realizado com sucesso! Carrinho finalizado e zerado.",
    carrinho: carrinhoAtualizado,
    licencas: licencasGeradas,
  });
});

/**
 * @swagger
 * /api/v1/biblioteca/{jogadorId}:
 *   get:
 *     summary: Retorna a biblioteca pessoal de jogos do jogador (licenças adquiridas)
 *     tags: [Biblioteca Pessoal]
 *     parameters:
 *       - in: path
 *         name: jogadorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de licenças do jogador
 */
router.get("/biblioteca/:jogadorId", (req, res) => {
  const { jogadorId } = req.params;
  const licencas = bibliotecaRepository.buscarPorJogador(Number(jogadorId));
  return res.status(200).json(licencas);
});

/**
 * @swagger
 * /api/v1/avaliacoes:
 *   post:
 *     summary: Envia uma avaliação/review pós-compra de um jogo
 *     tags: [Avaliações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jogadorId, jogoId, nota, comentario]
 *             properties:
 *               jogadorId:
 *                 type: integer
 *               jogoId:
 *                 type: integer
 *               nota:
 *                 type: integer
 *                 example: 5
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação enviada com sucesso
 *       403:
 *         description: O jogador só pode avaliar jogos que possui na biblioteca
 */
router.post("/avaliacoes", (req, res) => {
  const { jogadorId, jogoId, nota, comentario } = req.body;

  if (!bibliotecaRepository.possuiLicenca(jogadorId, jogoId)) {
    return res.status(403).json({
      mensagem: "Você só pode avaliar jogos que comprou e estão em sua biblioteca.",
    });
  }

  const avaliacao = avaliacaoRepository.criar({
    jogadorId,
    jogoId,
    nota,
    comentario,
    dataCriacao: new Date(),
  });

  return res.status(201).json(avaliacao);
});

/**
 * @swagger
 * /api/v1/avaliacoes/jogo/{jogoId}:
 *   get:
 *     summary: Lista todas as avaliações de um jogo específico
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: jogoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de avaliações do jogo obtida com sucesso
 */
router.get("/avaliacoes/jogo/:jogoId", (req, res) => {
  const jogoId = Number(req.params.jogoId);
  const avaliacoes = avaliacaoRepository.buscarPorJogo(jogoId);
  return res.status(200).json(avaliacoes);
});

export default router;