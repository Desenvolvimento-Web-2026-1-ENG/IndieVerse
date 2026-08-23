import { Categoria } from "@entities/Categoria";

export interface CriarCategoriaDTO {
  nome: string;
}

export interface AtualizarCategoriaDTO {
  nome: string;
}

export class CategoriaService {
  constructor(private categoriaRepository: any) {}

  listarTodas(): Categoria[] {
    return this.categoriaRepository.listarTodas();
  }

  buscarPorId(id: number): Categoria {
    const categoria = this.categoriaRepository.buscarPorId(id);
    if (!categoria) {
      throw new Error("Categoria não encontrada.");
    }
    return categoria;
  }

  criar(dados: CriarCategoriaDTO): Categoria {
    if (!dados.nome || dados.nome.trim() === "") {
      throw new Error("O nome da categoria é obrigatório.");
    }
    return this.categoriaRepository.criar(dados);
  }

  atualizar(id: number, dados: AtualizarCategoriaDTO): Categoria {
    if (!dados.nome || dados.nome.trim() === "") {
      throw new Error("O nome da categoria é obrigatório.");
    }
    const categoria = this.categoriaRepository.atualizar(id, dados);
    if (!categoria) {
      throw new Error("Categoria não encontrada.");
    }
    return categoria;
  }

  deletar(id: number): void {
    const deletada = this.categoriaRepository.excluir(id);
    if (!deletada) {
      throw new Error("Categoria não encontrada.");
    }
  }
}