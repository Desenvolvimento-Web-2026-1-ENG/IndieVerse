import { Categoria } from "@entities/Categoria";
import { ICategoriaRepository } from "@repositories/ICategoriaRepository";
import { ITarefaRepository } from "@repositories/ITarefaRepository";
import { CriarCategoriaDTO } from "./dtos/CategoriaDTOs.js";

export class CategoriaService {
  constructor(
    private categoriaRepo: ICategoriaRepository,
    private tarefaRepo: ITarefaRepository, // Injetado para checar exclusão
  ) {}

  listarTodas(): Categoria[] {
    return this.categoriaRepo.listarTodas();
  }

  criar(dados: CriarCategoriaDTO): Categoria {
    const existe = this.categoriaRepo.buscarPorNome(dados.nome);
    if (existe) {
      throw new Error("Já existe uma categoria com este nome.");
    }
    return this.categoriaRepo.criar(dados);
  }

  excluir(id: number): void {
    const categoria = this.categoriaRepo.buscarPorId(id);
    if (!categoria) {
      throw new Error("Categoria não encontrada.");
    }

    const tarefasVinculadas = this.tarefaRepo.buscarPorCategoria(id);
    if (tarefasVinculadas.length > 0) {
      throw new Error(
        "Não é possível excluir a categoria, pois existem tarefas vinculadas a ela.",
      );
    }

    this.categoriaRepo.excluir(id);
  }
}
