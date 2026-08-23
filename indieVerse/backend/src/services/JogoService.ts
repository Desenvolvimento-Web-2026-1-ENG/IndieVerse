import { Jogo } from "@entities/Jogo";
import { IJogoRepository } from "../repositories/IJogoRepository";

export interface CriarJogoDTO {
  titulo: string;
  descricao?: string;
  preco: number;
  requisitosMinimos?: string;
  categoriaId: number;
  desenvolvedorId: number;
}

export class JogoService {
  constructor(private jogoRepository: IJogoRepository) {}

  listarTodos(): Jogo[] {
    return this.jogoRepository.listarTodos();
  }

  buscarPorId(id: number): Jogo {
    const jogo = this.jogoRepository.buscarPorId(id);
    if (!jogo) {
      throw new Error("Jogo não encontrado.");
    }
    return jogo;
  }

  criar(dados: CriarJogoDTO): Jogo {
    if (!dados.titulo || dados.preco === undefined || !dados.categoriaId || !dados.desenvolvedorId) {
      throw new Error("Campos obrigatórios ausentes.");
    }

    return this.jogoRepository.criar({
      titulo: dados.titulo,
      descricao: dados.descricao ?? "",
      preco: dados.preco,
      requisitosMinimos: dados.requisitosMinimos ?? "",
      categoriaId: dados.categoriaId,
      desenvolvedorId: dados.desenvolvedorId,
    });
  }
}