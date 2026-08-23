export interface AdicionarItemCarrinhoDTO {
  jogadorId: number;
  jogoId: number;
}

export interface CriarAvaliacaoDTO {
  jogadorId: number;
  jogoId: number;
  nota: number;
  comentario: string;
}

export class LojaService {
  constructor(
    private carrinhoRepository: any,
    private bibliotecaRepository: any,
    private avaliacaoRepository: any
  ) {}

  adicionarItemCarrinho(dados: AdicionarItemCarrinhoDTO) {
    if (!dados.jogadorId || !dados.jogoId) {
      throw new Error("jogadorId e jogoId são obrigatórios.");
    }
    return this.carrinhoRepository.adicionarItem(
      Number(dados.jogadorId),
      Number(dados.jogoId)
    );
  }

  obterCarrinho(jogadorId: number) {
    return this.carrinhoRepository.obterCarrinho(jogadorId);
  }

  removerItemCarrinho(jogadorId: number, jogoId: number) {
    const removido = this.carrinhoRepository.removerItem(jogadorId, jogoId);
    if (!removido) {
      throw new Error("Item não encontrado no carrinho.");
    }
  }

  realizarCheckout(jogadorId: number) {
    if (!jogadorId) {
      throw new Error("jogadorId inválido.");
    }

    const carrinho = this.carrinhoRepository.obterCarrinho(jogadorId);

    if (carrinho.status !== "ABERTO") {
      throw new Error(`O carrinho atual não está ABERTO (Status atual: ${carrinho.status}).`);
    }

    if (carrinho.itens.length === 0) {
      throw new Error("O carrinho está vazio.");
    }

    const licencasGeradas = carrinho.itens.map((item: any) =>
      this.bibliotecaRepository.adicionarLicenca(item.jogadorId, item.jogoId)
    );

    const carrinhoAtualizado = this.carrinhoRepository.atualizarStatus(jogadorId, "FINALIZADO");

    return {
      carrinho: carrinhoAtualizado,
      licencas: licencasGeradas,
    };
  }

  obterBiblioteca(jogadorId: number) {
    return this.bibliotecaRepository.buscarPorJogador(jogadorId);
  }

  criarAvaliacao(dados: CriarAvaliacaoDTO) {
    const possuiLicenca = this.bibliotecaRepository.possuiLicenca(
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

    return this.avaliacaoRepository.criar({
      jogadorId: dados.jogadorId,
      jogoId: dados.jogoId,
      nota: dados.nota,
      comentario: dados.comentario,
      dataCriacao: new Date(),
    });
  }

  listarAvaliacoesPorJogo(jogoId: number) {
    return this.avaliacaoRepository.buscarPorJogo(jogoId);
  }
}