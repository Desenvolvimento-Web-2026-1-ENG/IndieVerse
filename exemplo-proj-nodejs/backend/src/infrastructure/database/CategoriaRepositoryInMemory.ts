import { Categoria } from "@entities/Categoria";
import { ICategoriaRepository } from "@repositories/ICategoriaRepository";

let categorias: Categoria[] = [];
let proximoId = 1;

export class CategoriaRepositoryInMemory implements ICategoriaRepository {
  listarTodas(): Categoria[] {
    return categorias;
  }

  buscarPorId(id: number): Categoria | undefined {
    return categorias.find((c) => c.id === id);
  }

  criar(dados: Omit<Categoria, "id">): Categoria {
    const novaCategoria: Categoria = {
      id: proximoId++,
      ...dados,
    };
    categorias.push(novaCategoria);
    return novaCategoria;
  }

  atualizar(id: number, dados: Partial<Categoria>): Categoria | undefined {
    const categoriaExistente = categorias.find((c) => c.id === id);
    if (!categoriaExistente) return undefined;

    const categoriaAtualizada: Categoria = {
      id,
      nome: dados.nome ?? categoriaExistente.nome,
    };

    const index = categorias.findIndex((c) => c.id === id);
    categorias[index] = categoriaAtualizada;

    return categoriaAtualizada;
  }

  excluir(id: number): boolean {
    const tamanhoInicial = categorias.length;
    categorias = categorias.filter((c) => c.id !== id);
    return categorias.length < tamanhoInicial;
  }
}