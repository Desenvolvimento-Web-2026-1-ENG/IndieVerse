import api from './api';

export const meusJogosService = {
  getJogos: () => api.get('/jogos'),
  
  getAvaliacoesPorJogo: async (jogoId) => {
    try {
      return await api.get(`/avaliacoes/jogo/${jogoId}`);
    } catch {
      return await api.get(`/jogos/${jogoId}/avaliacoes`);
    }
  }
};