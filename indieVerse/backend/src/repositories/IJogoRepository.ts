import { Jogo } from "@entities/Jogo";

export interface IJogoRepository {
  listarTodos(): Promise<any[]>;
  buscarPorId(id: any): Promise<any | null>;
  buscarPorCategoria(categoriaId: any): Promise<any[]>;
  criar(dados: {
    titulo: string;
    descricao: string;
    preco: number;
    requisitosMinimos?: string | null;
    categoriaId: any;
    desenvolvedorId: any;
  }): Promise<any>;
  atualizar(
    id: any,
    dados: {
      titulo?: string;
      descricao?: string;
      preco?: number;
      requisitosMinimos?: string | null;
      categoriaId?: any;
      desenvolvedorId?: any;
    }
  ): Promise<any | null>;
  excluir(id: any): Promise<boolean>;
}