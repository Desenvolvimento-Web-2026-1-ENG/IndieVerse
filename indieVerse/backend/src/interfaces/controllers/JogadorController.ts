import { Request, Response } from "express";
import { JogadorService } from "../../services/JogadorService";

export class JogadorController {
  constructor(private jogadorService: JogadorService) {}

  listarTodos = async (req: Request, res: Response): Promise<Response> => {
    const jogadores = await this.jogadorService.listarTodos();
    return res.status(200).json(jogadores);
  };

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const jogador = await this.jogadorService.buscarPorId(req.params.id);
      return res.status(200).json(jogador);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const jogador = await this.jogadorService.criar(req.body);
      return res.status(201).json(jogador);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const jogador = await this.jogadorService.atualizar(req.params.id, req.body);
      return res.status(200).json(jogador);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  deletar = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.jogadorService.deletar(req.params.id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };
}