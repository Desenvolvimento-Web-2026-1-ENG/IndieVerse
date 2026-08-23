import { Router } from "express";
import { JogadorController } from "../../../interfaces/controllers/JogadorController";
import { JogadorService } from "../../../services/JogadorService";
import { JogadorRepositoryInMemory } from "@infrastructure/database/JogadorRepositoryInMemory";

const router = Router();

const jogadorRepository = new JogadorRepositoryInMemory();
const jogadorService = new JogadorService(jogadorRepository);
const jogadorController = new JogadorController(jogadorService);

/**
 * @swagger
 * /api/v1/jogadores:
 *   post:
 *     summary: Cadastra um novo jogador
 *     tags: [Jogadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email]
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Jogador cadastrado com sucesso
 *   get:
 *     summary: Lista todos os jogadores
 *     tags: [Jogadores]
 *     responses:
 *       200:
 *         description: Lista de jogadores cadastrados
 */
router.post("/jogadores", (req, res) => jogadorController.criar(req, res));
router.get("/jogadores", (req, res) => jogadorController.listarTodos(req, res));

/**
 * @swagger
 * /api/v1/jogadores/{id}:
 *   get:
 *     summary: Busca perfil de um jogador por ID
 *     tags: [Jogadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do jogador obtidos com sucesso
 *       404:
 *         description: Jogador não encontrado
 *   put:
 *     summary: Atualiza dados de um jogador
 *     tags: [Jogadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Jogador atualizado com sucesso
 *       404:
 *         description: Jogador não encontrado
 *   delete:
 *     summary: Remove um jogador da plataforma
 *     tags: [Jogadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Jogador removido com sucesso
 *       404:
 *         description: Jogador não encontrado
 */
router.get("/jogadores/:id", (req, res) => jogadorController.buscarPorId(req, res));
router.put("/jogadores/:id", (req, res) => jogadorController.atualizar(req, res));
router.delete("/jogadores/:id", (req, res) => jogadorController.deletar(req, res));

export default router;