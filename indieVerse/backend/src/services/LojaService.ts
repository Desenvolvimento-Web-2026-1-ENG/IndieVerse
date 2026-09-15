export interface AdicionarItemCarrinhoDTO {
  jogadorId: any;
  jogoId: any;
}

export interface CriarAvaliacaoDTO {
  jogadorId: any;
  jogoId: any;
  nota: number;
  comentario: string;
}

export class LojaService {
  constructor(
    private carrinhoRepository: any,
    private bibliotecaRepository: any,
    private avaliacaoRepository: any
  ) {}

  async adicionarItemCarrinho(dados: AdicionarItemCarrinhoDTO) {
    if (!dados.jogadorId || !dados.jogoId) {
      throw new Error("jogadorId e jogoId são obrigatórios.");
    }
    return await this.carrinhoRepository.adicionarItem(
      dados.jogadorId,
      dados.jogoId
    );
  }

  async obterCarrinho(jogadorId: any) {
    return await this.carrinhoRepository.obterCarrinho(jogadorId);
  }

  async removerItemCarrinho(jogadorId: any, jogoId: any) {
    const removido = await this.carrinhoRepository.removerItem(jogadorId, jogoId);
    if (!removido) {
      throw new Error("Item não encontrado no carrinho.");
    }
  }

  async realizarCheckout(jogadorId: any) {
    if (!jogadorId) {
      throw new Error("jogadorId inválido.");
    }

    const carrinho = await this.carrinhoRepository.obterCarrinho(jogadorId);

    if (carrinho.status !== "ABERTO") {
      throw new Error(`O carrinho atual não está ABERTO (Status atual: ${carrinho.status}).`);
    }

    if (!carrinho.itens || carrinho.itens.length === 0) {
      throw new Error("O carrinho está vazio.");
    }

    const licencasGeradas = await Promise.all(
      carrinho.itens.map((item: any) =>
        this.bibliotecaRepository.adicionarLicenca(item.jogadorId, item.jogoId)
      )
    );

    const carrinhoAtualizado = await this.carrinhoRepository.atualizarStatus(jogadorId, "FINALIZADO");

    return {
      carrinho: carrinhoAtualizado,
      licencas: licencasGeradas,
    };
  }

  async obterBiblioteca(jogadorId: any) {
    return await this.bibliotecaRepository.buscarPorJogador(jogadorId);
  }

  async criarAvaliacao(dados: CriarAvaliacaoDTO) {
    const possuiLicenca = await this.bibliotecaRepository.possuiLicenca(
      dados.jogadorId,
      dados.jogoId
    );

    if (!possuiLicenca) {
      const error: any = new Error(
        "Você só pode avaliar jogos que comprou e estão em sua biblioteca."
      );
      error.statusCode = 403;
      throw error;
    }

    return await this.avaliacaoRepository.criar({
      jogadorId: dados.jogadorId,
      jogoId: dados.jogoId,
      nota: dados.nota,
      comentario: dados.comentario,
    });
  }

  async listarAvaliacoesPorJogo(jogoId: any) {
    return await this.avaliacaoRepository.buscarPorJogo(jogoId);
  }
}