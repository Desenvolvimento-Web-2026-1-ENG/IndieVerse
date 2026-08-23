import { Router } from "express";
import { DesenvolvedorController } from "../../../interfaces/controllers/DesenvolvedorController";
import { DesenvolvedorService } from "../../../services/DesenvolvedorService";
import { DesenvolvedorRepositoryInMemory } from "@infrastructure/database/DesenvolvedorRepositoryInMemory";

const router = Router();

const devRepository = new DesenvolvedorRepositoryInMemory();
const devService = new DesenvolvedorService(devRepository);
const devController = new DesenvolvedorController(devService);

/**
 * @swagger
 * /api/v1/desenvolvedores:
 *   post:
 *     summary: Cadastra um novo desenvolvedor/estúdio
 *     tags: [Desenvolvedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nomeEstudio, email]
 *             properties:
 *               nomeEstudio:
 *                 type: string
 *               email:
 *                 type: string
 *               siteOuRedeSocial:
 *                 type: string
 *     responses:
 *       201:
 *         description: Desenvolvedor cadastrado com sucesso
 *   get:
 *     summary: Lista todos os desenvolvedores cadastrados
 *     tags: [Desenvolvedores]
 *     responses:
 *       200:
 *         description: Lista de desenvolvedores
 */
router.post("/desenvolvedores", (req, res) => devController.criar(req, res));
router.get("/desenvolvedores", (req, res) => devController.listarTodos(req, res));

/**
 * @swagger
 * /api/v1/desenvolvedores/{id}:
 *   get:
 *     summary: Busca dados de um desenvolvedor por ID
 *     tags: [Desenvolvedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do desenvolvedor encontrados
 *       404:
 *         description: Desenvolvedor não encontrado
 *   put:
 *     summary: Atualiza perfil do desenvolvedor
 *     tags: [Desenvolvedores]
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
 *               nomeEstudio:
 *                 type: string
 *               email:
 *                 type: string
 *               siteOuRedeSocial:
 *                 type: string
 *     responses:
 *       200:
 *         description: Desenvolvedor atualizado com sucesso
 *       404:
 *         description: Desenvolvedor não encontrado
 *   delete:
 *     summary: Remove um desenvolvedor da plataforma
 *     tags: [Desenvolvedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Desenvolvedor removido com sucesso
 *       404:
 *         description: Desenvolvedor não encontrado
 */
router.get("/desenvolvedores/:id", (req, res) => devController.buscarPorId(req, res));
router.put("/desenvolvedores/:id", (req, res) => devController.atualizar(req, res));
router.delete("/desenvolvedores/:id", (req, res) => devController.deletar(req, res));

export default router;