export class Jogador {
  constructor(
    public id: number,
    public nome: string,
    public email: string,
    public dataCriacao: Date = new Date()
  ) {}
}