import api from './api';

export const categoriaService = {
  listarTodas: () => api.get('/categorias'),
  buscarPorId: (id) => api.get(`/categorias/${id}`),
  criar: (categoriaData) => api.post('/categorias', categoriaData),
  atualizar: (id, categoriaData) => api.put(`/categorias/${id}`, categoriaData),
  deletar: (id) => api.delete(`/categorias/${id}`)
};