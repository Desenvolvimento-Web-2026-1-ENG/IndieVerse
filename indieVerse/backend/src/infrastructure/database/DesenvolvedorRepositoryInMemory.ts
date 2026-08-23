import { Desenvolvedor } from "@entities/Desenvolvedor";

export class DesenvolvedorRepositoryInMemory {
  private desenvolvedores: Desenvolvedor[] = [];
  private proximoId = 1;

  criar(dados: Omit<Desenvolvedor, "id" | "dataCriacao">): Desenvolvedor {
    const dev = new Desenvolvedor(this.proximoId++, dados.nomeEstudio, dados.email, dados.siteOuRedeSocial);
    this.desenvolvedores.push(dev);
    return dev;
  }

  listarTodos(): Desenvolvedor[] {
    return this.desenvolvedores;
  }

  buscarPorId(id: number): Desenvolvedor | undefined {
    return this.desenvolvedores.find((d) => d.id === id);
  }

  atualizar(id: number, dados: Partial<Omit<Desenvolvedor, "id" | "dataCriacao">>): Desenvolvedor | undefined {
    const dev = this.buscarPorId(id);
    if (!dev) return undefined;

    if (dados.nomeEstudio) dev.nomeEstudio = dados.nomeEstudio;
    if (dados.email) dev.email = dados.email;
    if (dados.siteOuRedeSocial !== undefined) dev.siteOuRedeSocial = dados.siteOuRedeSocial;

    return dev;
  }

  deletar(id: number): boolean {
    const index = this.desenvolvedores.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.desenvolvedores.splice(index, 1);
    return true;
  }
}