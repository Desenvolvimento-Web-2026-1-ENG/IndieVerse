import { Router } from "express";
import { CategoriaController } from "../../../interfaces/controllers/CategoriaController";
import { CategoriaService } from "../../../services/CategoriaService";
import { CategoriaRepositoryInMemory } from "@infrastructure/database/CategoriaRepositoryInMemory";

const router = Router();

const categoriaRepository = new CategoriaRepositoryInMemory();
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

/**
 * @swagger
 * /api/v1/categorias:
 *   get:
 *     summary: Lista todas as categorias de jogos
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias cadastradas
 *   post:
 *     summary: Cadastra uma nova categoria de jogos
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
 *         description: Categoria cadastrada com sucesso
 *       400:
 *         description: Nome da categoria é obrigatório
 */
router.get("/categorias", (req, res) => categoriaController.listarTodas(req, res));
router.post("/categorias", (req, res) => categoriaController.criar(req, res));

/**
 * @swagger
 * /api/v1/categorias/{id}:
 *   get:
 *     summary: Busca uma categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 *   put:
 *     summary: Atualiza o nome de uma categoria por ID
 *     tags: [Categorias]
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
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *   delete:
 *     summary: Deleta uma categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.get("/categorias/:id", (req, res) => categoriaController.buscarPorId(req, res));
router.put("/categorias/:id", (req, res) => categoriaController.atualizar(req, res));
router.delete("/categorias/:id", (req, res) => categoriaController.deletar(req, res));

export default router;