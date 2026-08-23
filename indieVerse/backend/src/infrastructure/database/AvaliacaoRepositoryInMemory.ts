import { Avaliacao } from "@entities/Avaliacao";

let avaliacoes: Avaliacao[] = [];
let proximoId = 1;

export class AvaliacaoRepositoryInMemory {
  criar(dados: Omit<Avaliacao, "id">): Avaliacao {
    const novaAvaliacao: Avaliacao = {
      id: proximoId++,
      ...dados,
    };
    avaliacoes.push(novaAvaliacao);
    return novaAvaliacao;
  }

  buscarPorJogo(jogoId: number): Avaliacao[] {
    return avaliacoes.filter((a) => a.jogoId === jogoId);
  }
}