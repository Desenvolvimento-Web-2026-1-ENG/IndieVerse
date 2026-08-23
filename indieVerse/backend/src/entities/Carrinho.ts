export type StatusCarrinho = "ABERTO" | "FINALIZADO" | "CANCELADO";

export interface ItemCarrinho {
  jogadorId: number;
  jogoId: number;
}

export interface Carrinho {
  jogadorId: number;
  status: StatusCarrinho;
  itens: ItemCarrinho[];
}