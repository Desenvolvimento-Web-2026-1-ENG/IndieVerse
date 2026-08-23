import { Router } from "express";
import { DesenvolvedorRepositoryInMemory } from "@infrastructure/database/DesenvolvedorRepositoryInMemory";

const router = Router();
const devRepository = new DesenvolvedorRepositoryInMemory();

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
router.post("/desenvolvedores", (req, res) => {
  const { nomeEstudio, email, siteOuRedeSocial } = req.body;
  if (!nomeEstudio || !email) {
    return res.status(400).json({ mensagem: "Nome do Estúdio e Email são obrigatórios." });
  }
  const dev = devRepository.criar({ nomeEstudio, email, siteOuRedeSocial });
  return res.status(201).json(dev);
});

router.get("/desenvolvedores", (req, res) => {
  return res.status(200).json(devRepository.listarTodos());
});

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
router.get("/desenvolvedores/:id", (req, res) => {
  const dev = devRepository.buscarPorId(Number(req.params.id));
  if (!dev) return res.status(404).json({ mensagem: "Desenvolvedor não encontrado." });
  return res.status(200).json(dev);
});

router.put("/desenvolvedores/:id", (req, res) => {
  const dev = devRepository.atualizar(Number(req.params.id), req.body);
  if (!dev) return res.status(404).json({ mensagem: "Desenvolvedor não encontrado." });
  return res.status(200).json(dev);
});

router.delete("/desenvolvedores/:id", (req, res) => {
  const deletado = devRepository.deletar(Number(req.params.id));
  if (!deletado) return res.status(404).json({ mensagem: "Desenvolvedor não encontrado." });
  return res.status(204).send();
});

export default router;