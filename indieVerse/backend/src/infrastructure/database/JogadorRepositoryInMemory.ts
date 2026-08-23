import { Jogador } from "@entities/Jogador";

export class JogadorRepositoryInMemory {
  private jogadores: Jogador[] = [];
  private proximoId = 1;

  criar(dados: Omit<Jogador, "id" | "dataCriacao">): Jogador {
    const jogador = new Jogador(this.proximoId++, dados.nome, dados.email);
    this.jogadores.push(jogador);
    return jogador;
  }

  listarTodos(): Jogador[] {
    return this.jogadores;
  }

  buscarPorId(id: number): Jogador | undefined {
    return this.jogadores.find((j) => j.id === id);
  }

  atualizar(id: number, dados: Partial<Omit<Jogador, "id" | "dataCriacao">>): Jogador | undefined {
    const jogador = this.buscarPorId(id);
    if (!jogador) return undefined;
    
    if (dados.nome) jogador.nome = dados.nome;
    if (dados.email) jogador.email = dados.email;

    return jogador;
  }

  deletar(id: number): boolean {
    const index = this.jogadores.findIndex((j) => j.id === id);
    if (index === -1) return false;
    this.jogadores.splice(index, 1);
    return true;
  }
}