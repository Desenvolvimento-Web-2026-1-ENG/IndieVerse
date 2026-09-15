import { Desenvolvedor } from "@entities/Desenvolvedor";

export interface CriarDesenvolvedorDTO {
  nomeEstudio: string;
  email: string;
  siteOuRedeSocial?: string;
}

export interface AtualizarDesenvolvedorDTO {
  nomeEstudio?: string;
  email?: string;
  siteOuRedeSocial?: string;
}

export class DesenvolvedorService {
  constructor(private devRepository: any) {}

  async listarTodos(): Promise<Desenvolvedor[]> {
    return await this.devRepository.listarTodos();
  }

  async buscarPorId(id: any): Promise<Desenvolvedor> {
    const dev = await this.devRepository.buscarPorId(id);
    if (!dev) {
      throw new Error("Desenvolvedor não encontrado.");
    }
    return dev;
  }

  async criar(dados: CriarDesenvolvedorDTO): Promise<Desenvolvedor> {
    if (!dados.nomeEstudio || !dados.email) {
      throw new Error("Nome do Estúdio e Email são obrigatórios.");
    }
    return await this.devRepository.criar(dados);
  }

  async atualizar(id: any, dados: AtualizarDesenvolvedorDTO): Promise<Desenvolvedor> {
    const dev = await this.devRepository.atualizar(id, dados);
    if (!dev) {
      throw new Error("Desenvolvedor não encontrado.");
    }
    return dev;
  }

  async deletar(id: any): Promise<void> {
    const deletado = await this.devRepository.deletar(id);
    if (!deletado) {
      throw new Error("Desenvolvedor não encontrado.");
    }
  }
}