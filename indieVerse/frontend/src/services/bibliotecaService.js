import api from './api';

export const bibliotecaService = {
  getBibliotecaPorUsuario: (usuarioId) => api.get(`/biblioteca/${usuarioId}`),
  getJogos: () => api.get('/jogos'),
  enviarAvaliacao: (payload) => api.post('/avaliacoes', payload)
};