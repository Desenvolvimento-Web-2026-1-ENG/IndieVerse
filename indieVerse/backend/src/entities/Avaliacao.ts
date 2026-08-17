export interface Avaliacao {
  id: number;
  jogadorId: number;
  jogoId: number;
  nota: number; 
  comentario: string;
  dataCriacao: Date;
}