import { Jogo } from "@entities/Jogo";
import { IJogoRepository } from "../repositories/IJogoRepository";

export interface CriarJogoDTO {
  titulo: string;
  descricao?: string;
  preco: number;
  requisitosMinimos?: string;
  categoriaId: any;
  desenvolvedorId: any;
}

export class JogoService {
  constructor(private jogoRepository: IJogoRepository) {}

  async listarTodos(): Promise<Jogo[]> {
    return await this.jogoRepository.listarTodos();
  }

  async buscarPorId(id: any): Promise<Jogo> {
    const jogo = await this.jogoRepository.buscarPorId(id);
    if (!jogo) {
      throw new Error("Jogo não encontrado.");
    }
    return jogo;
  }

  async criar(dados: CriarJogoDTO): Promise<Jogo> {
    if (!dados.titulo || dados.preco === undefined || !dados.categoriaId || !dados.desenvolvedorId) {
      throw new Error("Campos obrigatórios ausentes.");
    }

    return await this.jogoRepository.criar({
      titulo: dados.titulo,
      descricao: dados.descricao ?? "",
      preco: dados.preco,
      requisitosMinimos: dados.requisitosMinimos ?? "",
      categoriaId: dados.categoriaId,
      desenvolvedorId: dados.desenvolvedorId,
    });
  }
}