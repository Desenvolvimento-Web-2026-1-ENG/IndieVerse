import { Request, Response } from "express";
import { JogoService } from "../../services/JogoService";

export class JogoController {
  constructor(private jogoService: JogoService) {}

  listar = async (req: Request, res: Response): Promise<Response> => {
    const jogos = await this.jogoService.listarTodos();
    return res.status(200).json(jogos);
  };

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const jogo = await this.jogoService.buscarPorId(id);
      return res.status(200).json(jogo);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const novoJogo = await this.jogoService.criar(req.body);
      return res.status(201).json(novoJogo);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };
}