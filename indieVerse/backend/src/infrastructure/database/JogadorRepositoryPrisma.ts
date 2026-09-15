import { prisma } from "./prisma";

export class JogadorRepositoryPrisma {
  async criar(dados: { nome: string; email: string; senha?: string }) {
    return await prisma.jogador.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha || "",
      },
    });
  }

  async listarTodos() {
    return await prisma.jogador.findMany({
      include: {
        licencas: true,
        carrinhos: true,
        avaliacoes: true,
      },
    });
  }

  async buscarPorId(id: any) {
    return await prisma.jogador.findUnique({
      where: {
        id: String(id),
      },
      include: {
        licencas: true,
        carrinhos: true,
        avaliacoes: true,
      },
    });
  }

  async atualizar(id: any, dados: { nome?: string; email?: string; senha?: string }) {
    try {
      return await prisma.jogador.update({
        where: {
          id: String(id),
        },
        data: {
          ...(dados.nome && { nome: dados.nome }),
          ...(dados.email && { email: dados.email }),
          ...(dados.senha && { senha: dados.senha }),
        },
      });
    } catch (error) {
      return null;
    }
  }

  async deletar(id: any): Promise<boolean> {
    try {
      await prisma.jogador.delete({
        where: {
          id: String(id),
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}