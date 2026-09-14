import api from './api';

export const usuarioService = {
  listarJogadores: () => api.get('/jogadores'),
  buscarJogadorPorId: (id) => api.get(`/jogadores/${id}`),
  cadastrarJogador: (dados) => api.post('/jogadores', dados),
  atualizarJogador: (id, dados) => api.put(`/jogadores/${id}`, dados),
  deletarJogador: (id) => api.delete(`/jogadores/${id}`),

  listarDesenvolvedores: () => api.get('/desenvolvedores'),
  buscarDesenvolvedorPorId: (id) => api.get(`/desenvolvedores/${id}`),
  cadastrarDesenvolvedor: (dados) => api.post('/desenvolvedores', dados),
  atualizarDesenvolvedor: (id, dados) => api.put(`/desenvolvedores/${id}`, dados),
  deletarDesenvolvedor: (id) => api.delete(`/desenvolvedores/${id}`),
};