import { useState, useEffect } from 'react';
import { categoriaService } from '../services/categoriaService';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setCarregando(true);
      const res = await categoriaService.listarTodas();
      setCategorias(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setCarregando(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      setSalvando(true);
      if (editandoId) {
        await categoriaService.atualizar(editandoId, { nome });
      } else {
        await categoriaService.criar({ nome });
      }
      cancelarEdicao();
      await carregarCategorias();
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      alert('Erro ao salvar categoria');
    } finally {
      setSalvando(false);
    }
  };

  const editar = async (cat) => {
    try {
      setEditandoId(cat.id);
    
      const res = await categoriaService.buscarPorId(cat.id);
      const categoriaAtualizada = res.data;

      setNome(categoriaAtualizada.nome || cat.nome);
    } catch (err) {
      console.error('Erro ao buscar detalhes da categoria:', err);
      setNome(cat.nome);
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome('');
  };

  const deletar = async (id) => {
    if (confirm('Deseja excluir esta categoria?')) {
      try {
        await categoriaService.deletar(id);
        await carregarCategorias();
      } catch (err) {
        console.error('Erro ao excluir categoria:', err);
        alert('Erro ao excluir categoria');
      }
    }
  };

  return {
    categorias,
    nome,
    editandoId,
    carregando,
    salvando,
    setNome,
    salvar,
    editar,
    cancelarEdicao,
    deletar
  };
}