import { ICategoriaRepository } from "../repositories/ICategoriaRepository";

export class CategoriaService {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async listarTodas() {
    return await this.categoriaRepository.listarTodas();
  }

  async buscarPorId(id: any) {
    const categoria = await this.categoriaRepository.buscarPorId(id);
    if (!categoria) {
      throw new Error("Categoria não encontrada.");
    }
    return categoria;
  }

  async criar(dados: { nome: string }) {
    if (!dados.nome) {
      throw new Error("O nome da categoria é obrigatório.");
    }
    return await this.categoriaRepository.criar(dados);
  }

  async atualizar(id: any, dados: { nome?: string }) {
    const categoria = await this.categoriaRepository.atualizar(id, dados);
    if (!categoria) {
      throw new Error("Categoria não encontrada para atualização.");
    }
    return categoria;
  }

  async deletar(id: any) {
    const deletado = await this.categoriaRepository.excluir(id);
    if (!deletado) {
      throw new Error("Categoria não encontrada para exclusão.");
    }
  }
}