import { Carrinho, ItemCarrinho, StatusCarrinho } from "@entities/Carrinho";

const carrinhos: Map<number, Carrinho> = new Map();

export class CarrinhoRepositoryInMemory {
  obterCarrinho(jogadorId: number): Carrinho {
    let carrinho = carrinhos.get(jogadorId);
    if (!carrinho) {
      carrinho = {
        jogadorId,
        status: "ABERTO",
        itens: []
      };
      carrinhos.set(jogadorId, carrinho);
    }
    return carrinho;
  }

  adicionarItem(jogadorId: number, jogoId: number): Carrinho {
    const carrinho = this.obterCarrinho(jogadorId);

    if (carrinho.status !== "ABERTO") {
      carrinho.status = "ABERTO";
      carrinho.itens = [];
    }

    const jaExiste = carrinho.itens.some((item) => item.jogoId === jogoId);
    if (!jaExiste) {
      carrinho.itens.push({ jogadorId, jogoId });
    }

    return carrinho;
  }

  removerItem(jogadorId: number, jogoId: number): boolean {
    const carrinho = this.obterCarrinho(jogadorId);
    if (carrinho.status !== "ABERTO") return false;

    const index = carrinho.itens.findIndex((item) => item.jogoId === jogoId);
    if (index === -1) return false;

    carrinho.itens.splice(index, 1);
    return true;
  }

  atualizarStatus(jogadorId: number, novoStatus: StatusCarrinho): Carrinho {
    const carrinho = this.obterCarrinho(jogadorId);
    carrinho.status = novoStatus;
    if (novoStatus === "FINALIZADO" || novoStatus === "CANCELADO") {
      carrinho.itens = [];
    }
    return carrinho;
  }
}