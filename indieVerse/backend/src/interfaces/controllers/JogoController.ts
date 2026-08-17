import { Request, Response } from "express";
import { JogoRepositoryInMemory } from "@infrastructure/database/JogoRepositoryInMemory";

const jogoRepository = new JogoRepositoryInMemory();

export class JogoController {
  listar(req: Request, res: Response): Response {
    const jogos = jogoRepository.listarTodos();
    return res.status(200).json(jogos);
  }

  criar(req: Request, res: Response): Response {
    const {
      titulo,
      descricao,
      preco,
      requisitosMinimos,
      categoriaId,
      desenvolvedorId,
    } = req.body;

    if (!titulo || !preco || !categoriaId || !desenvolvedorId) {
      return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
    }

    const novoJogo = jogoRepository.criar({
      titulo,
      descricao: descricao ?? "",
      preco,
      requisitosMinimos: requisitosMinimos ?? "",
      categoriaId,
      desenvolvedorId,
    });

    return res.status(201).json(novoJogo);
  }

  buscarPorId(req: Request, res: Response): Response {
    const { id } = req.params;
    const jogo = jogoRepository.buscarPorId(Number(id));

    if (!jogo) {
      return res.status(404).json({ mensagem: "Jogo não encontrado." });
    }

    return res.status(200).json(jogo);
  }
}