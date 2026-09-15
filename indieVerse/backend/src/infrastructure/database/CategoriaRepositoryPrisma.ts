import { ICategoriaRepository } from "@repositories/ICategoriaRepository";
import { prisma } from "./prisma";

export class CategoriaRepositoryPrisma implements ICategoriaRepository {
  async listarTodas(): Promise<any[]> {
    return await prisma.categoria.findMany();
  }

  async buscarPorId(id: any): Promise<any | null> {
    return await prisma.categoria.findUnique({
      where: {
        id: String(id),
      },
    });
  }

  async criar(dados: { nome: string }): Promise<any> {
    return await prisma.categoria.create({
      data: {
        nome: dados.nome,
      },
    });
  }

  async atualizar(id: any, dados: { nome?: string }): Promise<any | null> {
    try {
      return await prisma.categoria.update({
        where: {
          id: String(id),
        },
        data: {
          ...(dados.nome && { nome: dados.nome }),
        },
      });
    } catch (error) {
      return null;
    }
  }

  async excluir(id: any): Promise<boolean> {
    try {
      await prisma.categoria.delete({
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