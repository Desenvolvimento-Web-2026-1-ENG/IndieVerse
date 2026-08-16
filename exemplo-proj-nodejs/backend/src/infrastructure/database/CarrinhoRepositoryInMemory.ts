import { ItemCarrinho } from "@entities/Carrinho";

let carrinho: ItemCarrinho[] = [];

export class CarrinhoRepositoryInMemory {
  obterCarrinho(jogadorId: number): ItemCarrinho[] {
    return carrinho.filter((item) => item.jogadorId === jogadorId);
  }

  adicionarItem(jogadorId: number, jogoId: number): void {
    const jaExiste = carrinho.some(
      (item) => item.jogadorId === jogadorId && item.jogoId === jogoId
    );
    if (!jaExiste) {
      carrinho.push({ jogadorId, jogoId });
    }
  }

  limparCarrinho(jogadorId: number): void {
    carrinho = carrinho.filter((item) => item.jogadorId !== jogadorId);
  }
}