import { Licenca } from "@entities/Licenca";
import { IBibliotecaRepository } from "@repositories/IBibliotecaRepository";

let licencas: Licenca[] = [];
let proximoId = 1;

export class BibliotecaRepositoryInMemory implements IBibliotecaRepository {
  adicionarLicenca(jogadorId: number, jogoId: number): Licenca {
    const novaLicenca: Licenca = {
      id: proximoId++,
      jogadorId,
      jogoId,
      dataAquisicao: new Date()
    };
    licencas.push(novaLicenca);
    return novaLicenca;
  }

  buscarPorJogador(jogadorId: number): Licenca[] {
    return licencas.filter((l) => l.jogadorId === jogadorId);
  }

  possuiLicenca(jogadorId: number, jogoId: number): boolean {
    return licencas.some((l) => l.jogadorId === jogadorId && l.jogoId === jogoId);
  }
}