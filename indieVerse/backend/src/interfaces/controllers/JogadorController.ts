import { Request, Response } from "express";
import { JogadorService } from "../../services/JogadorService";

export class JogadorController {
  constructor(private jogadorService: JogadorService) {}

  listarTodos = (req: Request, res: Response): Response => {
    const jogadores = this.jogadorService.listarTodos();
    return res.status(200).json(jogadores);
  };

  buscarPorId = (req: Request, res: Response): Response => {
    try {
      const jogador = this.jogadorService.buscarPorId(Number(req.params.id));
      return res.status(200).json(jogador);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = (req: Request, res: Response): Response => {
    try {
      const jogador = this.jogadorService.criar(req.body);
      return res.status(201).json(jogador);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  atualizar = (req: Request, res: Response): Response => {
    try {
      const jogador = this.jogadorService.atualizar(Number(req.params.id), req.body);
      return res.status(200).json(jogador);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  deletar = (req: Request, res: Response): Response => {
    try {
      this.jogadorService.deletar(Number(req.params.id));
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };
}