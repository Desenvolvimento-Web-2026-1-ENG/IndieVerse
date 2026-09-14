import { useState, useEffect } from 'react';
import { meusJogosService } from '../services/meusJogosService';

export function useMeusJogos(usuario) {
  const [meusJogos, setMeusJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(false);

  useEffect(() => {
    if (usuario?.id) {
      carregarMeusJogos();
    }
  }, [usuario?.id]);

  const carregarMeusJogos = async () => {
    try {
      setCarregando(true);
      const res = await meusJogosService.getJogos();
      const todosJogos = res.data || [];
      const filtrados = todosJogos.filter((j) => String(j.desenvolvedorId) === String(usuario.id));
      setMeusJogos(filtrados);
    } catch (error) {
      console.error('Erro ao carregar meus jogos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const verAvaliacoes = async (jogo) => {
    setJogoSelecionado(jogo);
    setCarregandoAvaliacoes(true);
    setAvaliacoes([]);

    try {
      const res = await meusJogosService.getAvaliacoesPorJogo(jogo.id);
      setAvaliacoes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setAvaliacoes([]);
    } finally {
      setCarregandoAvaliacoes(false);
    }
  };

  const fecharModalAvaliacoes = () => {
    setJogoSelecionado(null);
    setAvaliacoes([]);
  };

  return {
    meusJogos,
    carregando,
    jogoSelecionado,
    avaliacoes,
    carregandoAvaliacoes,
    verAvaliacoes,
    fecharModalAvaliacoes
  };
}