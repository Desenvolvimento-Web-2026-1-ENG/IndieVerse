import { Request, Response } from "express";
import { CategoriaService } from "@services/CategoriaService.js";

export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  listar(req: Request, res: Response): void {
    res.json(this.categoriaService.listarTodas());
  }

  criar(req: Request, res: Response): void {
    try {
      const nova = this.categoriaService.criar(req.body);
      res.status(201).json(nova);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }

  excluir(req: Request, res: Response): void {
    try {
      this.categoriaService.excluir(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      // Pode ser 404 (não achou) ou 400 (bloqueio por tarefas vinculadas)
      const status = error.message.includes("não encontrada") ? 404 : 400;
      res.status(status).json({ erro: error.message });
    }
  }
}
