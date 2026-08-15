import { Jogo } from "@entities/Jogo";
import { IJogoRepository } from "@repositories/IJogoRepository";

// Escopo global do módulo para simular um banco de dados único.
let jogos: Jogo[] = [
  {
    id: 1,
    titulo: "Cat's Cafeteria",
    descricao: "Jogo de gerenciamento e aventura.",
    preco: 29.90,
    requisitosMinimos: "4GB RAM, GTX 660",
    categoriaId: 1,
    desenvolvedorId: 10
  }
];
let proximoId = 2;

export class JogoRepositoryInMemory implements IJogoRepository {
  listarTodas(): Jogo[] {
    return jogos;
  }

  buscarPorId(id: number): Jogo | undefined {
    return jogos.find((j) => j.id === id);
  }

  buscarPorCategoria(categoriaId: number): Jogo[] {
    return jogos.filter((j) => j.categoriaId === categoriaId);
  }

  criar(dados: Omit<Jogo, "id">): Jogo {
    const novoJogo: Jogo = {
      id: proximoId++,
      ...dados,
    };
    jogos.push(novoJogo);
    return novoJogo;
  }

  atualizar(id: number, dados: Partial<Jogo>): Jogo | undefined {
    const index = jogos.findIndex((j) => j.id === id);
    if (index === -1) return undefined;

    jogos[index] = { ...jogos[index], ...dados, id };
    return jogos[index];
  }

  excluir(id: number): boolean {
    const tamanhoInicial = jogos.length;
    jogos = tarefas.filter((j) => j.id !== id);

    return jogos.length < tamanhoInicial;
  }
}