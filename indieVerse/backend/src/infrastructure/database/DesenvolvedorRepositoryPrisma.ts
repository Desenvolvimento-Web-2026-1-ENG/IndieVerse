import { prisma } from "./prisma";

export class DesenvolvedorRepositoryPrisma {
  async criar(dados: { nomeEstudio?: string; nome?: string; email: string; siteOuRedeSocial?: string }) {
    const estudioNome = dados.nomeEstudio || dados.nome || "Estúdio Independente";

    return await prisma.desenvolvedor.create({
      data: {
        nome: estudioNome,
        email: dados.email,
        senha: "", 
        estudio: dados.siteOuRedeSocial || estudioNome,
      },
    });
  }

  async listarTodos() {
    return await prisma.desenvolvedor.findMany({
      include: {
        jogos: true,
      },
    });
  }

  async buscarPorId(id: any) {
    return await prisma.desenvolvedor.findUnique({
      where: {
        id: String(id),
      },
      include: {
        jogos: true,
      },
    });
  }

  async atualizar(id: any, dados: { nomeEstudio?: string; nome?: string; email?: string; siteOuRedeSocial?: string }) {
    try {
      return await prisma.desenvolvedor.update({
        where: {
          id: String(id),
        },
        data: {
          ...(dados.nomeEstudio && { nome: dados.nomeEstudio }),
          ...(dados.nome && { nome: dados.nome }),
          ...(dados.email && { email: dados.email }),
          ...(dados.siteOuRedeSocial && { estudio: dados.siteOuRedeSocial }),
        },
      });
    } catch (error) {
      return null;
    }
  }

  async deletar(id: any): Promise<boolean> {
    try {
      await prisma.desenvolvedor.delete({
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