import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

export default function Carrinho({ setTelaAtual }) {
  const { usuario } = useAuth();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: '' });

  useEffect(() => {
    carregarCarrinho();
  }, [usuario]);

  const carregarCarrinho = async () => {
    try {
      setCarregando(true);
      const [resCarrinho, resJogos] = await Promise.all([
        axios.get(`/api/v1/carrinho/${usuario.id}`).catch(() => ({ data: [] })),
        axios.get('/api/v1/jogos').catch(() => ({ data: [] }))
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
      await axios.delete(`/api/v1/carrinho/${usuario.id}/item/${idJogo}`);
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
      await axios.put(`/api/v1/carrinho/${usuario.id}/checkout`);
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

  if (carregando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-secondary fs-5">Carregando seu carrinho...</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast({ mensagem: '', tipo: '' })} />

      <h1 className="h2 text-white fw-bold mb-4 d-flex align-items-center gap-2">
        🛒 Seu Carrinho
      </h1>

      {itens.length === 0 ? (
        <div className="card bg-dark text-white border-secondary text-center p-5 shadow-sm rounded-4">
          <div className="display-3 mb-3">🛍️</div>
          <h3 className="h4 text-white fw-bold mb-2">Seu carrinho está vazio</h3>
          <p className="text-secondary mb-4">
            Explore o catálogo de jogos indies e adicione os seus favoritos!
          </p>
          <div>
            <button
              onClick={() => setTelaAtual('loja')}
              className="btn btn-primary px-4 py-2 fw-semibold rounded-3 shadow-sm"
            >
              Ir para a Loja
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {itens.map((item, index) => {
            const titulo = extrairTitulo(item);
            const preco = extrairPreco(item);
            const keyUnica = item.id || `item-${index}`;

            return (
              <div
                key={keyUnica}
                className="card bg-dark text-white border-secondary p-3 shadow-sm rounded-3 d-flex flex-row justify-content-between align-items-center"
              >
                <div>
                  <h5 className="mb-1 fw-semibold text-white">{titulo}</h5>
                  <span className="badge bg-purple text-light fs-6 fw-bold px-2 py-1" style={{ backgroundColor: '#8b5cf6' }}>
                    R$ {preco.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => removerDoCarrinho(item)}
                  className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold"
                >
                  Remover
                </button>
              </div>
            );
          })}

          <div className="card bg-dark text-white border-secondary p-4 shadow-sm rounded-3 mt-2 d-flex flex-row justify-content-between align-items-center">
            <div>
              <span className="text-secondary fs-6 d-block mb-1">Total do Pedido:</span>
              <div className="text-success fs-3 fw-bold">
                R$ {valorTotal.toFixed(2)}
              </div>
            </div>

            <button
              onClick={finalizarCompra}
              disabled={finalizando}
              className={`btn btn-success btn-lg px-4 py-2 fw-bold d-flex align-items-center gap-2 ${finalizando ? 'disabled' : ''}`}
            >
              {finalizando ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Processando...
                </>
              ) : (
                <>
                  💳 Finalizar Compra
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}