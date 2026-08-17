import { Categoria } from "@entities/Categoria";

export interface ICategoriaRepository {
  listarTodas(): Categoria[];
  buscarPorId(id: number): Categoria | undefined;
  criar(dados: Omit<Categoria, "id">): Categoria;
  atualizar(id: number, dados: Partial<Categoria>): Categoria | undefined;
  excluir(id: number): boolean;
}