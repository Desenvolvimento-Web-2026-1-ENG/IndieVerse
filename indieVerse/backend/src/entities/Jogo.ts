export interface Jogo {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  requisitosMinimos: string;
  categoriaId: number;
  desenvolvedorId: number;
}