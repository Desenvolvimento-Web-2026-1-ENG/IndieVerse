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

  listarTodos(): Desenvolvedor[] {
    return this.devRepository.listarTodos();
  }

  buscarPorId(id: number): Desenvolvedor {
    const dev = this.devRepository.buscarPorId(id);
    if (!dev) {
      throw new Error("Desenvolvedor não encontrado.");
    }
    return dev;
  }

  criar(dados: CriarDesenvolvedorDTO): Desenvolvedor {
    if (!dados.nomeEstudio || !dados.email) {
      throw new Error("Nome do Estúdio e Email são obrigatórios.");
    }
    return this.devRepository.criar(dados);
  }

  atualizar(id: number, dados: AtualizarDesenvolvedorDTO): Desenvolvedor {
    const dev = this.devRepository.atualizar(id, dados);
    if (!dev) {
      throw new Error("Desenvolvedor não encontrado.");
    }
    return dev;
  }

  deletar(id: number): void {
    const deletado = this.devRepository.deletar(id);
    if (!deletado) {
      throw new Error("Desenvolvedor não encontrado.");
    }
  }
}