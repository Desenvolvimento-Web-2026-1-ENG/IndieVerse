import { IJogoRepository } from "@repositories/IJogoRepository";
import { prisma } from "./prisma";

export class JogoRepositoryPrisma implements IJogoRepository {
  async listarTodos(): Promise<any[]> {
    return await prisma.jogo.findMany({
      include: {
        categoria: true,
        desenvolvedor: true,
      },
    });
  }

  async buscarPorId(id: any): Promise<any | null> {
    return await prisma.jogo.findUnique({
      where: {
        id: String(id),
      },
      include: {
        categoria: true,
        desenvolvedor: true,
      },
    });
  }

  async buscarPorCategoria(categoriaId: any): Promise<any[]> {
    return await prisma.jogo.findMany({
      where: {
        categoriaId: String(categoriaId),
      },
      include: {
        categoria: true,
        desenvolvedor: true,
      },
    });
  }

  async criar(dados: {
    titulo: string;
    descricao: string;
    preco: number;
    requisitosMinimos?: string | null;
    categoriaId: any;
    desenvolvedorId: any;
  }): Promise<any> {
    return await prisma.jogo.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        preco: Number(dados.preco),
        requisitosMinimos: dados.requisitosMinimos || null,
        categoriaId: String(dados.categoriaId),
        desenvolvedorId: String(dados.desenvolvedorId),
      },
      include: {
        categoria: true,
        desenvolvedor: true,
      },
    });
  }

  async atualizar(
    id: any,
    dados: {
      titulo?: string;
      descricao?: string;
      preco?: number;
      requisitosMinimos?: string | null;
      categoriaId?: any;
      desenvolvedorId?: any;
    }
  ): Promise<any | null> {
    try {
      return await prisma.jogo.update({
        where: {
          id: String(id),
        },
        data: {
          ...(dados.titulo && { titulo: dados.titulo }),
          ...(dados.descricao && { descricao: dados.descricao }),
          ...(dados.preco !== undefined && { preco: Number(dados.preco) }),
          ...(dados.requisitosMinimos !== undefined && { requisitosMinimos: dados.requisitosMinimos }),
          ...(dados.categoriaId && { categoriaId: String(dados.categoriaId) }),
          ...(dados.desenvolvedorId && { desenvolvedorId: String(dados.desenvolvedorId) }),
        },
        include: {
          categoria: true,
          desenvolvedor: true,
        },
      });
    } catch (error) {
      return null;
    }
  }

  async excluir(id: any): Promise<boolean> {
    try {
      await prisma.jogo.delete({
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