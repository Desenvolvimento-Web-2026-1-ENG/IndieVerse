import api from './api';

export const carrinhoService = {
  getCarrinhoPorUsuario: (usuarioId) => api.get(`/carrinho/${usuarioId}`),
  getJogos: () => api.get('/jogos'),
  removerItem: (usuarioId, jogoId) => api.delete(`/carrinho/${usuarioId}/item/${jogoId}`),
  finalizarCheckout: (usuarioId) => api.put(`/carrinho/${usuarioId}/checkout`)
};