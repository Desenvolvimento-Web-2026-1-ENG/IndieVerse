import { useState, useEffect } from 'react';
import { carrinhoService } from '../services/carrinhoService';

export function useCarrinho(usuario) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: '' });

  useEffect(() => {
    if (usuario?.id) {
      carregarCarrinho();
    }
  }, [usuario?.id]);

  const carregarCarrinho = async () => {
    try {
      setCarregando(true);
      const [resCarrinho, resJogos] = await Promise.all([
        carrinhoService.getCarrinhoPorUsuario(usuario.id).catch(() => ({ data: [] })),
        carrinhoService.getJogos().catch(() => ({ data: [] }))
      ]);

      const todosJogos = Array.isArray(resJogos.data) ? resJogos.data : [];
      let dados = resCarrinho.data;
      let listaItens = [];

      if (Array.isArray(dados)) {
        listaItens = dados;
      } else if (dados && Array.isArray(dados.itens)) {
        listaItens = dados.itens;
      } else if (dados && Array.isArray(dados.carrinho)) {
        listaItens = dados.carrinho;
      } else if (dados && typeof dados === 'object') {
        listaItens = dados.jogos || dados.itensCarrinho || [];
      }

      const itensCompletos = listaItens.map((item) => {
        const idDoJogo = item.jogoId || item.idJogo || item.id;
        const jogoEncontrado = todosJogos.find((j) => String(j.id) === String(idDoJogo)) || item.Jogo || item.jogo;

        return {
          ...item,
          idCarrinho: item.id,
          titulo: jogoEncontrado?.titulo || item.titulo || `Jogo #${idDoJogo}`,
          preco: jogoEncontrado?.preco ?? item.preco ?? 0
        };
      });

      setItens(itensCompletos);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setItens([]);
    } finally {
      setCarregando(false);
    }
  };

  const removerDoCarrinho = async (item) => {
    const idJogo = item.jogoId || item.idJogo || item.Jogo?.id || item.jogo?.id || item.id;

    if (!idJogo) {
      console.error('Não foi possível identificar o ID do jogo para remoção:', item);
      setToast({ mensagem: 'Erro ao identificar o jogo.', tipo: 'erro' });
      return;
    }

    try {
      await carrinhoService.removerItem(usuario.id, idJogo);
      setItens((prev) => prev.filter((i) => i !== item));
      setToast({ mensagem: 'Item removido do carrinho!', tipo: 'sucesso' });
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      setToast({ mensagem: 'Erro ao remover item do carrinho.', tipo: 'erro' });
    }
  };

  const finalizarCompra = async () => {
    if (itens.length === 0) return;
    setFinalizando(true);

    try {
      await carrinhoService.finalizarCheckout(usuario.id);
      setItens([]);
      setToast({ mensagem: 'Compra realizada com sucesso! Jogos adicionados à biblioteca.', tipo: 'sucesso' });
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      setToast({ mensagem: 'Erro ao processar a compra.', tipo: 'erro' });
    } finally {
      setFinalizando(false);
    }
  };

  const extrairPreco = (item) => {
    const p = item.Jogo?.preco ?? item.jogo?.preco ?? item.preco ?? 0;
    return Number(p) || 0;
  };

  const extrairTitulo = (item) => {
    return item.Jogo?.titulo || item.jogo?.titulo || item.titulo || `Jogo #${item.jogoId || item.id}`;
  };

  const valorTotal = itens.reduce((acc, item) => acc + extrairPreco(item), 0);

  const fecharToast = () => setToast({ mensagem: '', tipo: '' });

  return {
    itens,
    carregando,
    finalizando,
    toast,
    valorTotal,
    extrairPreco,
    extrairTitulo,
    removerDoCarrinho,
    finalizarCompra,
    fecharToast
  };
}