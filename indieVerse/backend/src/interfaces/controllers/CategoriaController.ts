import { Request, Response } from "express";
import { CategoriaService } from "../../services/CategoriaService";

export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  listarTodas = (req: Request, res: Response): Response => {
    const categorias = this.categoriaService.listarTodas();
    return res.status(200).json(categorias);
  };

  buscarPorId = (req: Request, res: Response): Response => {
    try {
      const categoria = this.categoriaService.buscarPorId(Number(req.params.id));
      return res.status(200).json(categoria);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = (req: Request, res: Response): Response => {
    try {
      const categoria = this.categoriaService.criar(req.body);
      return res.status(201).json(categoria);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  atualizar = (req: Request, res: Response): Response => {
    try {
      const categoria = this.categoriaService.atualizar(Number(req.params.id), req.body);
      return res.status(200).json(categoria);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  deletar = (req: Request, res: Response): Response => {
    try {
      this.categoriaService.deletar(Number(req.params.id));
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };
}