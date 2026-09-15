import { Request, Response } from "express";
import { LojaService } from "../../services/LojaService";

export class LojaController {
  constructor(private lojaService: LojaService) {}

  adicionarAoCarrinho = async (req: Request, res: Response): Promise<Response> => {
    try {
      const carrinho = await this.lojaService.adicionarItemCarrinho(req.body);
      return res.status(201).json({
        mensagem: "Item adicionado ao carrinho com sucesso.",
        carrinho,
      });
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  obterCarrinho = async (req: Request, res: Response): Promise<Response> => {
    const { jogadorId } = req.params;
    const carrinho = await this.lojaService.obterCarrinho(jogadorId);
    return res.status(200).json(carrinho);
  };

  removerDoCarrinho = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { jogadorId, jogoId } = req.params;
      await this.lojaService.removerItemCarrinho(jogadorId, jogoId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ mensagem: error.message });
    }
  };

  realizarCheckout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { jogadorId } = req.params;
      const resultado = await this.lojaService.realizarCheckout(jogadorId);
      return res.status(200).json({
        mensagem: "Checkout realizado com sucesso! Carrinho finalizado e zerado.",
        ...resultado,
      });
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  };

  obterBiblioteca = async (req: Request, res: Response): Promise<Response> => {
    const { jogadorId } = req.params;
    const licencas = await this.lojaService.obterBiblioteca(jogadorId);
    return res.status(200).json(licencas);
  };

  criarAvaliacao = async (req: Request, res: Response): Promise<Response> => {
    try {
      const avaliacao = await this.lojaService.criarAvaliacao(req.body);
      return res.status(201).json(avaliacao);
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json({ mensagem: error.message });
    }
  };

  listarAvaliacoesPorJogo = async (req: Request, res: Response): Promise<Response> => {
    const { jogoId } = req.params;
    const avaliacoes = await this.lojaService.listarAvaliacoesPorJogo(jogoId);
    return res.status(200).json(avaliacoes);
  };
}