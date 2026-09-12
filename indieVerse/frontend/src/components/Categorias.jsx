import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const carregarCategorias = async () => {
    try {
      const res = await api.get('/categorias');
      setCategorias(res.data);
    } catch (err) {
      console.error('Erro ao buscar categorias', err);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const salvar = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      if (editandoId) {
        await api.put(`/categorias/${editandoId}`, { nome });
      } else {
        await api.post('/categorias', { nome });
      }
      setNome('');
      setEditandoId(null);
      carregarCategorias();
    } catch (err) {
      alert('Erro ao salvar categoria');
    }
  };

  const editar = (cat) => {
    setEditandoId(cat.id);
    setNome(cat.nome);
  };

  const deletar = async (id) => {
    if (confirm('Deseja excluir esta categoria?')) {
      try {
        await api.delete(`/categorias/${id}`);
        carregarCategorias();
      } catch (err) {
        alert('Erro ao excluir');
      }
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Categorias</h2>
      <form onSubmit={salvar} className="card p-3 mb-4 bg-light">
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editandoId ? 'Atualizar' : 'Cadastrar'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => { setEditandoId(null); setNome(''); }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <ul className="list-group">
        {categorias.map((cat) => (
          <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{cat.nome}</span>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => editar(cat)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => deletar(cat.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}