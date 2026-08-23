import { Request, Response } from "express";
import { LojaService } from "../../services/LojaService";

export class LojaController {
  constructor(private lojaService: LojaService) {}

  adicionarAoCarrinho = (req: Request, res: Response): Response => {
    try {
      const carrinho = this.lojaService.adicionarItemCarrinho(req.body);
      return res.status(201).json({
        mensagem: "Item adicionado ao carrinho com sucesso.",
        carrinho,
      });
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  obterCarrinho = (req: Request, res: Response): Response => {
    const jogadorId = Number(req.params.jogadorId);
    const carrinho = this.lojaService.obterCarrinho(jogadorId);
    return res.status(200).json(carrinho);
  };

  removerDoCarrinho = (req: Request, res: Response): Response => {
    try {
      const jogadorId = Number(req.params.jogadorId);
      const jogoId = Number(req.params.jogoId);
      this.lojaService.removerItemCarrinho(jogadorId, jogoId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  realizarCheckout = (req: Request, res: Response): Response => {
    try {
      const jogadorId = Number(req.params.jogadorId);
      const resultado = this.lojaService.realizarCheckout(jogadorId);
      return res.status(200).json({
        mensagem: "Checkout realizado com sucesso! Carrinho finalizado e zerado.",
        ...resultado,
      });
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  obterBiblioteca = (req: Request, res: Response): Response => {
    const jogadorId = Number(req.params.jogadorId);
    const licencas = this.lojaService.obterBiblioteca(jogadorId);
    return res.status(200).json(licencas);
  };

  criarAvaliacao = (req: Request, res: Response): Response => {
    try {
      const avaliacao = this.lojaService.criarAvaliacao(req.body);
      return res.status(201).json(avaliacao);
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json({ mensagem: error.message });
    }
  };

  listarAvaliacoesPorJogo = (req: Request, res: Response): Response => {
    const jogoId = Number(req.params.jogoId);
    const avaliacoes = this.lojaService.listarAvaliacoesPorJogo(jogoId);
    return res.status(200).json(avaliacoes);
  };
}