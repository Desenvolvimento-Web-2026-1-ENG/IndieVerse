import { Licenca } from "@entities/Licenca";

export interface IBibliotecaRepository {
  adicionarLicenca(jogadorId: number, jogoId: number): Licenca;
  buscarPorJogador(jogadorId: number): Licenca[];
  possuiLicenca(jogadorId: number, jogoId: number): boolean;
}