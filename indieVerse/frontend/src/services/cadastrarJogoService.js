import api from './api';

export const cadastrarJogoService = {
  getCategorias: () => api.get('/categorias'),
  
  cadastrarJogo: (payload) => api.post('/jogos', payload)
};