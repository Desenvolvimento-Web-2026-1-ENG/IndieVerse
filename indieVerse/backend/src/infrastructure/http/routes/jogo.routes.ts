import { Router } from "express";
import { JogoController } from "../../../interfaces/controllers/JogoController";

const router = Router();
const jogoController = new JogoController();

/**
 * @swagger
 * /api/v1/jogos:
 *   get:
 *     summary: Retorna todos os jogos independentes cadastrados
 *     tags: [Jogos]
 *     responses:
 *       200:
 *         description: Lista de jogos obtida com sucesso
 *   post:
 *     summary: Cadastra um novo jogo (Apenas Desenvolvedores)
 *     tags: [Jogos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               requisitosMinimos:
 *                 type: string
 *               categoriaId:
 *                 type: integer
 *               desenvolvedorId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Jogo cadastrado com sucesso
 */
router.get("/jogos", (req, res) => jogoController.listar(req, res));
router.post("/jogos", (req, res) => jogoController.criar(req, res));

/**
 * @swagger
 * /api/v1/jogos/{id}:
 *   get:
 *     summary: Busca detalhes de um jogo pelo ID
 *     tags: [Jogos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Jogo encontrado
 *       404:
 *         description: Jogo não encontrado
 */
router.get("/jogos/:id", (req, res) => jogoController.buscarPorId(req, res));

export default router;