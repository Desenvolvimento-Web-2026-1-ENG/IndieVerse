export class Desenvolvedor {
  constructor(
    public id: number,
    public nomeEstudio: string,
    public email: string,
    public siteOuRedeSocial?: string,
    public dataCriacao: Date = new Date()
  ) {}
}