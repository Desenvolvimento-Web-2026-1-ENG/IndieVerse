import { Jogo } from "@entities/Jogo";
import { IJogoRepository } from "@repositories/IJogoRepository";

let jogos: Jogo[] = [];
let proximoId = 1;

export class JogoRepositoryInMemory implements IJogoRepository {
  listarTodos(): Jogo[] {
    return jogos;
  }

  buscarPorId(id: number): Jogo | undefined {
    return jogos.find((j) => j.id === id);
  }

  buscarPorCategoria(categoriaId: number): Jogo[] {
    return jogos.filter((j) => j.categoriaId === categoriaId);
  }

  criar(dados: Omit<Jogo, "id">): Jogo {
    const novoJogo: Jogo = { id: proximoId++, ...dados };
    jogos.push(novoJogo);
    return novoJogo;
  }

  atualizar(id: number, dados: Partial<Jogo>): Jogo | undefined {
    const jogoExistente = jogos.find((j) => j.id === id);
    if (!jogoExistente) return undefined;

    const jogoAtualizado: Jogo = {
      id,
      titulo: dados.titulo ?? jogoExistente.titulo,
      descricao: dados.descricao ?? jogoExistente.descricao,
      preco: dados.preco ?? jogoExistente.preco,
      requisitosMinimos: dados.requisitosMinimos ?? jogoExistente.requisitosMinimos,
      categoriaId: dados.categoriaId ?? jogoExistente.categoriaId,
      desenvolvedorId: dados.desenvolvedorId ?? jogoExistente.desenvolvedorId,
    };

    const index = jogos.findIndex((j) => j.id === id);
    jogos[index] = jogoAtualizado;

    return jogoAtualizado;
  }

  excluir(id: number): boolean {
    const tamanhoInicial = jogos.length;
    jogos = jogos.filter((j) => j.id !== id);
    return jogos.length < tamanhoInicial;
  }
}