import { Router } from "express";
import { JogadorRepositoryInMemory } from "@infrastructure/database/JogadorRepositoryInMemory";

const router = Router();
const jogadorRepository = new JogadorRepositoryInMemory();

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
router.post("/jogadores", (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ mensagem: "Nome e Email são obrigatórios." });
  }
  const jogador = jogadorRepository.criar({ nome, email });
  return res.status(201).json(jogador);
});

router.get("/jogadores", (req, res) => {
  return res.status(200).json(jogadorRepository.listarTodos());
});

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
router.get("/jogadores/:id", (req, res) => {
  const jogador = jogadorRepository.buscarPorId(Number(req.params.id));
  if (!jogador) return res.status(404).json({ mensagem: "Jogador não encontrado." });
  return res.status(200).json(jogador);
});

router.put("/jogadores/:id", (req, res) => {
  const jogador = jogadorRepository.atualizar(Number(req.params.id), req.body);
  if (!jogador) return res.status(404).json({ mensagem: "Jogador não encontrado." });
  return res.status(200).json(jogador);
});

router.delete("/jogadores/:id", (req, res) => {
  const deletado = jogadorRepository.deletar(Number(req.params.id));
  if (!deletado) return res.status(404).json({ mensagem: "Jogador não encontrado." });
  return res.status(204).send();
});

export default router;