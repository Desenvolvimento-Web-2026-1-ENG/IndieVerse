import { Request, Response } from "express";
import { DesenvolvedorService } from "../../services/DesenvolvedorService";

export class DesenvolvedorController {
  constructor(private devService: DesenvolvedorService) {}

  listarTodos = (req: Request, res: Response): Response => {
    const devs = this.devService.listarTodos();
    return res.status(200).json(devs);
  };

  buscarPorId = (req: Request, res: Response): Response => {
    try {
      const dev = this.devService.buscarPorId(Number(req.params.id));
      return res.status(200).json(dev);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = (req: Request, res: Response): Response => {
    try {
      const dev = this.devService.criar(req.body);
      return res.status(201).json(dev);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  atualizar = (req: Request, res: Response): Response => {
    try {
      const dev = this.devService.atualizar(Number(req.params.id), req.body);
      return res.status(200).json(dev);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  deletar = (req: Request, res: Response): Response => {
    try {
      this.devService.deletar(Number(req.params.id));
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };
}