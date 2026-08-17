import { Jogo } from "@entities/Jogo";

export interface IJogoRepository {
  listarTodos(): Jogo[];
  buscarPorId(id: number): Jogo | undefined;
  buscarPorCategoria(categoriaId: number): Jogo[];
  criar(dados: Omit<Jogo, "id">): Jogo;
  atualizar(id: number, dados: Partial<Jogo>): Jogo | undefined;
  excluir(id: number): boolean;
}