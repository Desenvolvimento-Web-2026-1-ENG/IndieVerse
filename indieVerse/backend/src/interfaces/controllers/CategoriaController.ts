import { Request, Response } from "express";
import { CategoriaService } from "../../services/CategoriaService";

export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  listarTodas = async (req: Request, res: Response): Promise<Response> => {
    const categorias = await this.categoriaService.listarTodas();
    return res.status(200).json(categorias);
  };

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categoria = await this.categoriaService.buscarPorId(req.params.id);
      return res.status(200).json(categoria);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categoria = await this.categoriaService.criar(req.body);
      return res.status(201).json(categoria);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categoria = await this.categoriaService.atualizar(req.params.id, req.body);
      return res.status(200).json(categoria);
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  deletar = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.categoriaService.deletar(req.params.id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };
}