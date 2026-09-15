import { prisma } from "./prisma";

export interface CriarAvaliacaoDTO {
  nota: number;
  comentario: string;
  jogadorId: string;
  jogoId: string;
}

export class AvaliacaoRepositoryPrisma {
  async criar(dados: CriarAvaliacaoDTO) {
    return await prisma.avaliacao.create({
      data: {
        nota: Number(dados.nota),
        comentario: dados.comentario,
        jogadorId: String(dados.jogadorId),
        jogoId: String(dados.jogoId),
      },
      include: {
        jogador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async buscarPorJogo(jogoId: string | number) {
    return await prisma.avaliacao.findMany({
      where: {
        jogoId: String(jogoId),
      },
      include: {
        jogador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }
}