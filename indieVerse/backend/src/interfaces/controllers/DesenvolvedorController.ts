import { Request, Response } from "express";
import { DesenvolvedorService } from "../../services/DesenvolvedorService";

export class DesenvolvedorController {
  constructor(private devService: DesenvolvedorService) {}

  listarTodos = async (req: Request, res: Response): Promise<Response> => {
    const devs = await this.devService.listarTodos();
    return res.status(200).json(devs);
  };

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dev = await this.devService.buscarPorId(req.params.id);
      return res.status(200).json(dev);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dev = await this.devService.criar(req.body);
      return res.status(201).json(dev);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dev = await this.devService.atualizar(req.params.id, req.body);
      return res.status(200).json(dev);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  deletar = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.devService.deletar(req.params.id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };
}