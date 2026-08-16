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
  carrinhoRepository.adicionarItem(jogadorId, jogoId);
  return res.status(201).json({ mensagem: "Item adicionado ao carrinho com sucesso." });
});

/**
 * @swagger
 * /api/v1/carrinho/{jogadorId}:
 *   get:
 *     summary: Lista todos os itens do carrinho do jogador
 *     tags: [Carrinho e Checkout]
 *     parameters:
 *       - in: path
 *         name: jogadorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de itens do carrinho obtida com sucesso
 */
router.get("/carrinho/:jogadorId", (req, res) => {
  const { jogadorId } = req.params;
  const itens = carrinhoRepository.obterCarrinho(Number(jogadorId));
  return res.status(200).json(itens);
});

/**
 * @swagger
 * /api/v1/carrinho/checkout:
 *   post:
 *     summary: Converte itens do carrinho em licenças da biblioteca do jogador e limpa o carrinho
 *     tags: [Carrinho e Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jogadorId]
 *             properties:
 *               jogadorId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Compra realizada com sucesso e licenças geradas
 *       400:
 *         description: Carrinho vazio ou ID inválido
 */
router.post("/carrinho/checkout", (req, res) => {
  const { jogadorId } = req.body;
  if (!jogadorId) {
    return res.status(400).json({ mensagem: "jogadorId é obrigatório." });
  }

  const itens = carrinhoRepository.obterCarrinho(Number(jogadorId));
  if (itens.length === 0) {
    return res.status(400).json({ mensagem: "O carrinho está vazio." });
  }

  const licencasGeradas = itens.map((item) =>
    bibliotecaRepository.adicionarLicenca(item.jogadorId, item.jogoId)
  );

  carrinhoRepository.limparCarrinho(Number(jogadorId));

  return res.status(200).json({
    mensagem: "Compra realizada com sucesso!",
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

export default router;