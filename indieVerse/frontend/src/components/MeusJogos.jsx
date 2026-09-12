import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MeusJogos({ setTelaAtual }) {
  const { usuario } = useAuth();
  const [meusJogos, setMeusJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(false);

  useEffect(() => {
    carregarMeusJogos();
  }, [usuario]);

  const carregarMeusJogos = async () => {
    try {
      setCarregando(true);
      const res = await axios.get('/api/v1/jogos');
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
      let res;
      try {
        res = await axios.get(`/api/v1/avaliacoes/jogo/${jogo.id}`);
      } catch {
        res = await axios.get(`/api/v1/jogos/${jogo.id}/avaliacoes`);
      }
      setAvaliacoes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setAvaliacoes([]);
    } finally {
      setCarregandoAvaliacoes(false);
    }
  };

  if (carregando) return <p style={{ color: '#fff' }}>Carregando seus jogos...</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>
          🛠️ Meus Jogos Publicados
        </h1>
        <button
          onClick={() => setTelaAtual('cadastrar-jogo')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#a855f7',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ➕ Publicar Novo Jogo
        </button>
      </div>

      {meusJogos.length === 0 ? (
        <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Você ainda não publicou nenhum jogo. Clique em "Publicar Novo Jogo" para começar!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {meusJogos.map((jogo) => (
            <div
              key={jogo.id}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '12px',
                padding: '1.2rem',
                border: '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {jogo.Categoria?.nome || 'Indie'}
                </span>
                <h3 style={{ margin: '0.5rem 0', color: '#f8fafc', fontSize: '1.25rem' }}>{jogo.titulo}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {jogo.descricao || 'Sem descrição.'}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '0.8rem' }}>
                  R$ {Number(jogo.preco).toFixed(2)}
                </div>

                <button
                  onClick={() => verAvaliacoes(jogo)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#eab308',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ⭐ Ver Avaliações Recebidas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {jogoSelecionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '550px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>⭐ Avaliações: {jogoSelecionado.titulo}</h3>
              <button
                onClick={() => setJogoSelecionado(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {carregandoAvaliacoes ? (
              <p style={{ color: '#94a3b8' }}>Carregando avaliações...</p>
            ) : avaliacoes.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Nenhuma avaliação recebida para este jogo ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {avaliacoes.map((av, index) => (
                  <div
                    key={av.id || index}
                    style={{
                      backgroundColor: '#0f172a',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #334155'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {av.Jogador?.nome || av.usuario?.nome || 'Jogador'}
                      </span>
                      <span style={{ color: '#eab308', fontSize: '0.9rem' }}>
                        {'⭐'.repeat(av.nota || 5)} ({av.nota}/5)
                      </span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0, fontStyle: 'italic' }}>
                      "{av.comentario}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setJogoSelecionado(null)}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#0f172a',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}