import { prisma } from "./prisma";

export class CarrinhoRepositoryPrisma {
  async obterCarrinho(jogadorId: any): Promise<any> {
    const id = String(jogadorId);

    const itens = await prisma.carrinho.findMany({
      where: {
        jogadorId: id,
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

    return {
      jogadorId: id,
      status: "ABERTO",
      itens: itens.map((item) => ({
        id: item.id,
        jogadorId: item.jogadorId,
        jogoId: item.jogoId,
        jogo: item.jogo,
      })),
    };
  }

  async adicionarItem(jogadorId: any, jogoId: any): Promise<any> {
    const idJogador = String(jogadorId);
    const idJogo = String(jogoId);

    const itemExistente = await prisma.carrinho.findFirst({
      where: {
        jogadorId: idJogador,
        jogoId: idJogo,
      },
    });

    if (!itemExistente) {
      await prisma.carrinho.create({
        data: {
          jogadorId: idJogador,
          jogoId: idJogo,
        },
      });
    }

    return await this.obterCarrinho(idJogador);
  }

  async removerItem(jogadorId: any, jogoId: any): Promise<boolean> {
    const idJogador = String(jogadorId);
    const idJogo = String(jogoId);

    const item = await prisma.carrinho.findFirst({
      where: {
        jogadorId: idJogador,
        jogoId: idJogo,
      },
    });

    if (!item) return false;

    await prisma.carrinho.delete({
      where: {
        id: item.id,
      },
    });

    return true;
  }

  async atualizarStatus(jogadorId: any, novoStatus: string): Promise<any> {
    const idJogador = String(jogadorId);

    if (novoStatus === "FINALIZADO" || novoStatus === "CANCELADO") {
      await prisma.carrinho.deleteMany({
        where: {
          jogadorId: idJogador,
        },
      });
    }

    return await this.obterCarrinho(idJogador);
  }
}