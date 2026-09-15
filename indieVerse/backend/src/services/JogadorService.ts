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

  async listarTodos(): Promise<Jogador[]> {
    return await this.jogadorRepository.listarTodos();
  }

  async buscarPorId(id: any): Promise<Jogador> {
    const jogador = await this.jogadorRepository.buscarPorId(id);
    if (!jogador) {
      throw new Error("Jogador não encontrado.");
    }
    return jogador;
  }

  async criar(dados: CriarJogadorDTO): Promise<Jogador> {
    if (!dados.nome || !dados.email) {
      throw new Error("Nome e Email são obrigatórios.");
    }
    return await this.jogadorRepository.criar(dados);
  }

  async atualizar(id: any, dados: AtualizarJogadorDTO): Promise<Jogador> {
    const jogador = await this.jogadorRepository.atualizar(id, dados);
    if (!jogador) {
      throw new Error("Jogador não encontrado.");
    }
    return jogador;
  }

  async deletar(id: any): Promise<void> {
    const deletado = await this.jogadorRepository.deletar(id);
    if (!deletado) {
      throw new Error("Jogador não encontrado.");
    }
  }
}