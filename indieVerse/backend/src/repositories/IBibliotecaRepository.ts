import { Licenca } from "@entities/Licenca";

export interface IBibliotecaRepository {
  adicionarLicenca(jogadorId: any, jogoId: any): Promise<any>;
  buscarPorJogador(jogadorId: any): Promise<any[]>;
  possuiLicenca(jogadorId: any, jogoId: any): Promise<boolean>;
}