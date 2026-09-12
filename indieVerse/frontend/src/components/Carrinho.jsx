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
    return <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }}>Carregando seu carrinho...</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast({ mensagem: '', tipo: '' })} />

      <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>🛒 Seu Carrinho</h1>

      {itens.length === 0 ? (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Seu carrinho está vazio</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Explore o catálogo de jogos indies e adicione os seus favoritos!
          </p>
          <button
            onClick={() => setTelaAtual('loja')}
            style={{
              padding: '0.7rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0070f3',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Ir para a Loja
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {itens.map((item, index) => {
            const titulo = extrairTitulo(item);
            const preco = extrairPreco(item);
            const keyUnica = item.id || `item-${index}`;

            return (
              <div
                key={keyUnica}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '10px',
                  padding: '1rem 1.2rem',
                  border: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 0.3rem 0', fontSize: '1.1rem' }}>{titulo}</h4>
                  <span style={{ color: '#a855f7', fontWeight: 'bold' }}>R$ {preco.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => removerDoCarrinho(item)}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                    >
                    Remover
                </button>
              </div>
            );
          })}

          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '10px',
            padding: '1.2rem',
            border: '1px solid #334155',
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total do Pedido:</span>
              <div style={{ color: '#22c55e', fontSize: '1.6rem', fontWeight: 'bold' }}>
                R$ {valorTotal.toFixed(2)}
              </div>
            </div>

            <button
              onClick={finalizarCompra}
              disabled={finalizando}
              style={{
                padding: '0.8rem 1.8rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: finalizando ? '#334155' : '#22c55e',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: finalizando ? 'not-allowed' : 'pointer'
              }}
            >
              {finalizando ? 'Processando...' : '💳 Finalizar Compra'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}