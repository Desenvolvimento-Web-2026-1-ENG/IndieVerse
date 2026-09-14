import { useState, useEffect } from 'react';
import { lojaService } from '../services/lojaService';

export function useLoja(usuario) {
  const [jogos, setJogos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  const [bibliotecaIds, setBibliotecaIds] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [usuario?.id]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [resJogos, resCat, resBib] = await Promise.allSettled([
        lojaService.getJogos(),
        lojaService.getCategorias(),
        usuario?.id ? lojaService.getBiblioteca(usuario.id) : Promise.resolve({ data: [] })
      ]);

      setJogos(resJogos.status === 'fulfilled' ? resJogos.value.data || [] : []);
      setCategorias(resCat.status === 'fulfilled' ? resCat.value.data || [] : []);

      const dadosBib = resBib.status === 'fulfilled' ? resBib.value.data || [] : [];
      const idsAdquiridos = dadosBib
        .map((lic) => lic.jogoId || lic.Jogo?.id)
        .filter((id) => id !== undefined);

      setBibliotecaIds(idsAdquiridos);
    } catch (error) {
      console.error('Erro ao carregar loja:', error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirDetalhes = async (jogo) => {
    setCarregandoAvaliacoes(true);
    setAvaliacoes([]);

    try {
      const resJogo = await lojaService.getJogoPorId(jogo.id);
      setJogoSelecionado(resJogo.data || jogo);

      const resAv = await lojaService.getAvaliacoes(jogo.id);
      setAvaliacoes(Array.isArray(resAv.data) ? resAv.data : []);
    } catch (error) {
      console.error("Erro ao carregar detalhes do jogo:", error);
      setJogoSelecionado(jogo);
      setAvaliacoes([]);
    } finally {
      setCarregandoAvaliacoes(false);
    }
  };

  const fecharDetalhes = () => setJogoSelecionado(null);

  const adicionarAoCarrinho = async (jogoId) => {
    try {
      await lojaService.adicionarAoCarrinho(usuario?.id, jogoId);
      setMensagem({ tipo: 'sucesso', texto: 'Jogo adicionado ao carrinho!' });
      setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao adicionar ou jogo já está no carrinho.' });
    }
  };

  const jogosFiltrados = categoriaSelecionada === 'todas'
    ? jogos
    : jogos.filter((j) => String(j.categoriaId || j.Categoria?.id) === String(categoriaSelecionada));

  return {
    jogosFiltrados,
    categorias,
    categoriaSelecionada,
    setCategoriaSelecionada,
    bibliotecaIds,
    carregando,
    mensagem,
    jogoSelecionado,
    avaliacoes,
    carregandoAvaliacoes,
    abrirDetalhes,
    fecharDetalhes,
    adicionarAoCarrinho
  };
}