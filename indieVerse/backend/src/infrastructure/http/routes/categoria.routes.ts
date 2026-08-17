import { Router } from "express";
import { CategoriaRepositoryInMemory } from "@infrastructure/database/CategoriaRepositoryInMemory";

const router = Router();
const categoriaRepository = new CategoriaRepositoryInMemory();

/**
 * @swagger
 * /api/v1/categorias:
 *   get:
 *     summary: Lista todas as categorias de jogos disponíveis
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias cadastradas
 *   post:
 *     summary: Cadastra uma nova categoria de jogo
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.get("/categorias", (req, res) => {
  return res.status(200).json(categoriaRepository.listarTodas());
});

router.post("/categorias", (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ mensagem: "O nome da categoria é obrigatório." });
  }
  const nova = categoriaRepository.criar({ nome });
  return res.status(201).json(nova);
});

export default router;