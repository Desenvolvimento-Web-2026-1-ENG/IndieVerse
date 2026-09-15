import { Categoria } from "@entities/Categoria";

export interface ICategoriaRepository {
  listarTodas(): Promise<any[]>;
  buscarPorId(id: any): Promise<any | null>;
  criar(dados: { nome: string }): Promise<any>;
  atualizar(id: any, dados: { nome?: string }): Promise<any | null>;
  excluir(id: any): Promise<boolean>;
}