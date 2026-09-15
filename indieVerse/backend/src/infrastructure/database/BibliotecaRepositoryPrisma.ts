import { IBibliotecaRepository } from "@repositories/IBibliotecaRepository";
import { prisma } from "./prisma";

export class BibliotecaRepositoryPrisma implements IBibliotecaRepository {
  async adicionarLicenca(jogadorId: number | string, jogoId: number | string) {
    return await prisma.licenca.create({
      data: {
        jogadorId: String(jogadorId),
        jogoId: String(jogoId),
      },
      include: {
        jogo: {
          include: {
            categoria: true,
            desenvolvedor: true,
          },
        },
      },
    });
  }

  async buscarPorJogador(jogadorId: number | string) {
    return await prisma.licenca.findMany({
      where: {
        jogadorId: String(jogadorId),
      },
      include: {
        jogo: {
          include: {
            categoria: true,
            desenvolvedor: true,
          },
        },
      },
    });
  }

  async possuiLicenca(jogadorId: number | string, jogoId: number | string): Promise<boolean> {
    const licenca = await prisma.licenca.findFirst({
      where: {
        jogadorId: String(jogadorId),
        jogoId: String(jogoId),
      },
    });

    return !!licenca;
  }
}