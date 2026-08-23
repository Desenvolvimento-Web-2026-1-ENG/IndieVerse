import { Router } from "express";
import { LojaController } from "../../../interfaces/controllers/LojaController";
import { LojaService } from "../../../services/LojaService";
import { CarrinhoRepositoryInMemory } from "@infrastructure/database/CarrinhoRepositoryInMemory";
import { BibliotecaRepositoryInMemory } from "@infrastructure/database/BibliotecaRepositoryInMemory";
import { AvaliacaoRepositoryInMemory } from "@infrastructure/database/AvaliacaoRepositoryInMemory";

const router = Router();

const carrinhoRepository = new CarrinhoRepositoryInMemory();
const bibliotecaRepository = new BibliotecaRepositoryInMemory();
const avaliacaoRepository = new AvaliacaoRepositoryInMemory();

const lojaService = new LojaService(
  carrinhoRepository,
  bibliotecaRepository,
  avaliacaoRepository
);
const lojaController = new LojaController(lojaService);

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
router.post("/carrinho", (req, res) => lojaController.adicionarAoCarrinho(req, res));

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
router.get("/carrinho/:jogadorId", (req, res) => lojaController.obterCarrinho(req, res));

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
router.delete("/carrinho/:jogadorId/item/:jogoId", (req, res) =>
  lojaController.removerDoCarrinho(req, res)
);

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
router.put("/carrinho/:jogadorId/checkout", (req, res) =>
  lojaController.realizarCheckout(req, res)
);

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
router.get("/biblioteca/:jogadorId", (req, res) =>
  lojaController.obterBiblioteca(req, res)
);

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
router.post("/avaliacoes", (req, res) => lojaController.criarAvaliacao(req, res));

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
router.get("/avaliacoes/jogo/:jogoId", (req, res) =>
  lojaController.listarAvaliacoesPorJogo(req, res)
);

export default router;