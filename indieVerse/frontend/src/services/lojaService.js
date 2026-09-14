import api from './api';

export const lojaService = {
  getJogos: () => api.get('/jogos'),
  getJogoPorId: (id) => api.get(`/jogos/${id}`),
  getCategorias: () => api.get('/categorias'),
  getBiblioteca: (usuarioId) => api.get(`/biblioteca/${usuarioId}`),
  getAvaliacoes: async (jogoId) => {
    try {
      return await api.get(`/avaliacoes/jogo/${jogoId}`);
    } catch {
      return await api.get(`/jogos/${jogoId}/avaliacoes`);
    }
  },
  adicionarAoCarrinho: (jogadorId, jogoId) => 
    api.post('/carrinho', { jogadorId, jogoId }),
};