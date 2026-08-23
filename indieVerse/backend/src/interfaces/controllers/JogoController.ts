import { Request, Response } from "express";
import { JogoService } from "../../services/JogoService";

export class JogoController {
  constructor(private jogoService: JogoService) {}

  listar = (req: Request, res: Response): Response => {
    const jogos = this.jogoService.listarTodos();
    return res.status(200).json(jogos);
  };

  buscarPorId = (req: Request, res: Response): Response => {
    try {
      const { id } = req.params;
      const jogo = this.jogoService.buscarPorId(Number(id));
      return res.status(200).json(jogo);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = (req: Request, res: Response): Response => {
    try {
      const novoJogo = this.jogoService.criar(req.body);
      return res.status(201).json(novoJogo);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };
}