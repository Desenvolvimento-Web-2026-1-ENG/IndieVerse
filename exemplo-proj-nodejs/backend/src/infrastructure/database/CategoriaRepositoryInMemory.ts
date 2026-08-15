import { Categoria } from "@entities/Categoria";
import { ICategoriaRepository } from "@repositories/ICategoriaRepository";

let categorias: Categoria[] = [
  { id: 1, nome: "Metroidvania" },
  { id: 2, nome: "RPG" },
  { id: 3, nome: "Simulação" }
];
let proximoId = 4;

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
    const index = categorias.findIndex((c) => c.id === id);
    if (index === -1) return undefined;

    categorias[index] = { ...categorias[index], ...dados, id };
    return categorias[index];
  }

  excluir(id: number): boolean {
    const tamanhoInicial = categorias.length;
    categorias = categorias.filter((c) => c.id !== id);

    return categorias.length < tamanhoInicial;
  }
}