import { Jogador } from "@entities/Jogador";

export interface CriarJogadorDTO {
  nome: string;
  email: string;
}

export interface AtualizarJogadorDTO {
  nome?: string;
  email?: string;
}

export class JogadorService {
  constructor(private jogadorRepository: any) {}

  listarTodos(): Jogador[] {
    return this.jogadorRepository.listarTodos();
  }

  buscarPorId(id: number): Jogador {
    const jogador = this.jogadorRepository.buscarPorId(id);
    if (!jogador) {
      throw new Error("Jogador não encontrado.");
    }
    return jogador;
  }

  criar(dados: CriarJogadorDTO): Jogador {
    if (!dados.nome || !dados.email) {
      throw new Error("Nome e Email são obrigatórios.");
    }
    return this.jogadorRepository.criar(dados);
  }

  atualizar(id: number, dados: AtualizarJogadorDTO): Jogador {
    const jogador = this.jogadorRepository.atualizar(id, dados);
    if (!jogador) {
      throw new Error("Jogador não encontrado.");
    }
    return jogador;
  }

  deletar(id: number): void {
    const deletado = this.jogadorRepository.deletar(id);
    if (!deletado) {
      throw new Error("Jogador não encontrado.");
    }
  }
}