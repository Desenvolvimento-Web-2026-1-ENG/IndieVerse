import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Biblioteca() {
  const { usuario } = useAuth();
  const [licencas, setLicencas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [jogoParaAvaliar, setJogoParaAvaliar] = useState(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    carregarBiblioteca();
  }, [usuario]);

  const carregarBiblioteca = async () => {
    try {
      setCarregando(true);
      const [resBib, resJogos] = await Promise.all([
        axios.get(`/api/v1/biblioteca/${usuario.id}`).catch(() => ({ data: [] })),
        axios.get('/api/v1/jogos').catch(() => ({ data: [] }))
      ]);

      const listaJogos = resJogos.data || [];
      const listaLicencas = resBib.data || [];

      const licencasFormatadas = listaLicencas.map((lic) => {
        const idDoJogo = lic.jogoId || lic.JogoId || lic.Jogo?.id || lic.jogo?.id;
        const jogoEncontrado = listaJogos.find((j) => String(j.id) === String(idDoJogo));

        return {
          ...lic,
          dadosJogo: jogoEncontrado || lic.Jogo || lic.jogo || { id: idDoJogo, titulo: `Jogo #${idDoJogo}` }
        };
      });

      setLicencas(licencasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error);
    } finally {
      setCarregando(false);
    }
  };

  const enviarAvaliacao = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        jogadorId: usuario.id,
        usuarioId: usuario.id,
        jogoId: jogoParaAvaliar.id,
        nota: Number(nota),
        comentario
      };

      await axios.post('/api/v1/avaliacoes', payload);

      setMensagem({ tipo: 'sucesso', texto: 'Avaliação enviada com sucesso!' });
      setJogoParaAvaliar(null);
      setComentario('');
      setNota(5);
      setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      
      if (error.response?.status === 403) {
        setMensagem({ 
          tipo: 'erro', 
          texto: 'Erro 403 (Proibido): Alterne o perfil para Jogador no topo para enviar a avaliação.' 
        });
      } else {
        setMensagem({ tipo: 'erro', texto: 'Erro ao enviar avaliação. Verifique a conexão com o servidor.' });
      }
    }
  };

  if (carregando) return <p style={{ color: '#fff' }}>Carregando sua biblioteca...</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>
        📚 Minha Biblioteca
      </h1>

      {mensagem.texto && (
        <div style={{
          padding: '0.8rem',
          marginBottom: '1rem',
          borderRadius: '6px',
          backgroundColor: mensagem.tipo === 'sucesso' ? '#22c55e' : '#ef4444',
          color: '#fff'
        }}>
          {mensagem.texto}
        </div>
      )}

      {licencas.length === 0 ? (
        <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Sua biblioteca está vazia. Explore a loja e garanta seus primeiros jogos!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {licencas.map((lic) => {
            const jogo = lic.dadosJogo;
            return (
              <div
                key={lic.id || jogo.id}
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
                  <span style={{ fontSize: '0.75rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    ✓ Licença Ativa
                  </span>
                  <h3 style={{ margin: '0.5rem 0', color: '#f8fafc', fontSize: '1.25rem' }}>
                    {jogo.titulo || `Jogo #${jogo.id}`}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {jogo.descricao || 'Licença ativa associada à sua conta.'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#22c55e',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ▶️ Jogar
                  </button>

                  <button
                    onClick={() => setJogoParaAvaliar(jogo)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#eab308',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ⭐ Avaliar Jogo
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {jogoParaAvaliar && (
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
            maxWidth: '500px',
            width: '100%',
            border: '1px solid #334155'
          }}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>⭐ Avaliar {jogoParaAvaliar.titulo}</h3>

            <form onSubmit={enviarAvaliacao} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  Nota (1 a 5 estrelas):
                </label>
                <select
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Muito Bom)</option>
                  <option value={3}>⭐⭐⭐ (3 - Bom)</option>
                  <option value={2}>⭐⭐ (2 - Regular)</option>
                  <option value={1}>⭐ (1 - Ruim)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  Comentário:
                </label>
                <textarea
                  rows="3"
                  required
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escreva o que achou do jogo..."
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setJogoParaAvaliar(null)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#eab308', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Enviar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}