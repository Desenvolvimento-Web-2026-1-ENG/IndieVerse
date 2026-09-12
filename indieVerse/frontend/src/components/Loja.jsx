import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Loja({ aoMudarAba }) {
  const [jogos, setJogos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  const [bibliotecaIds, setBibliotecaIds] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(false);

  const { usuario } = useAuth();

  useEffect(() => {
    carregarDados();
  }, [usuario]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [resJogos, resCat, resBib] = await Promise.all([
        axios.get('/api/v1/jogos').catch(() => ({ data: [] })),
        axios.get('/api/v1/categorias').catch(() => ({ data: [] })),
        axios.get(`/api/v1/biblioteca/${usuario?.id}`).catch(() => ({ data: [] }))
      ]);

      setJogos(resJogos.data || []);
      setCategorias(resCat.data || []);

      const idsAdquiridos = (resBib.data || []).map((lic) => lic.jogoId || lic.Jogo?.id);
      setBibliotecaIds(idsAdquiridos);
    } catch (error) {
      console.error('Erro ao carregar loja:', error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirDetalhes = async (jogo) => {
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

      const lista = Array.isArray(res.data) ? res.data : [];
      setAvaliacoes(lista);
    } catch (error) {
      console.error('Nenhuma avaliação encontrada ou erro na rota:', error);
      setAvaliacoes([]);
    } finally {
      setCarregandoAvaliacoes(false);
    }
  };

  const adicionarAoCarrinho = async (jogoId) => {
    try {
      await axios.post('/api/v1/carrinho', {
        jogadorId: usuario?.id,
        jogoId: jogoId
      });
      setMensagem({ tipo: 'sucesso', texto: 'Jogo adicionado ao carrinho!' });
      setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao adicionar ou jogo já está no carrinho.' });
    }
  };

  const jogosFiltrados = categoriaSelecionada === 'todas'
    ? jogos
    : jogos.filter((j) => String(j.categoriaId || j.Categoria?.id) === String(categoriaSelecionada));

  if (carregando) return <p style={{ color: '#fff', textAlign: 'center', marginTop: '2rem' }}>Carregando catálogo...</p>;

  return (
    <div style={{ backgroundColor: '#0b0c10', color: '#fff', minHeight: '100vh', paddingBottom: '3rem' }}>
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at top left, #1f1235 0%, #0b0c10 70%)',
        padding: '4rem 2rem',
        borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{
              display: 'inline-block',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              marginBottom: '1.2rem'
            }}>
              ❄️ NOVA TEMPORADA INDIE
            </span>

            <h1 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: '1.1', margin: '0 0 1.2rem 0', color: '#fff' }}>
              O universo dos <br />
              <span style={{
                background: 'linear-gradient(90deg, #c084fc 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                jogos independentes
              </span> <br />
              mora aqui.
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '500px' }}>
              Milhares de jogos feitos por estúdios pequenos, artistas solo e mentes inquietas. Encontre seu próximo favorito.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <a
                href="#destaques"
                style={{
                  padding: '0.8rem 1.6rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)'
                }}
              >
                Explorar a loja &rarr;
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: 'bold' }}>12k+</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>jogos indie</p>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: 'bold' }}>3.4k</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>estúdios</p>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: 'bold' }}>98%</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>satisfação</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '420px',
              height: '360px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(56, 189, 248, 0.1))',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              padding: '8px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
                alt="Banner IndieVerse"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', opacity: 0.85 }}
              />
            </div>
          </div>
        </div>
      </section>

      <div id="destaques" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎮 Jogos em Destaque
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Filtrar por Categoria:</label>
            <select
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <option value="todas">Todas as Categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {mensagem.texto && (
          <div style={{
            padding: '0.8rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            backgroundColor: mensagem.tipo === 'sucesso' ? '#22c55e' : '#ef4444',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            {mensagem.texto}
          </div>
        )}

        {jogosFiltrados.length === 0 ? (
          <p style={{ color: '#94a3b8', padding: '2rem 0' }}>Nenhum jogo encontrado para esta categoria.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {jogosFiltrados.map((jogo) => {
              const jaPossui = bibliotecaIds.includes(jogo.id);

              return (
                <div 
                  key={jogo.id} 
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    border: '1px solid #334155',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {jogo.Categoria?.nome || 'Indie'}
                    </span>
                    <h3 style={{ 
                      margin: '0.5rem 0', 
                      color: '#f8fafc', 
                      fontSize: '1.25rem',
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {jogo.titulo || jogo.nome}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {jogo.descricao || 'Sem descrição disponível.'}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '0.8rem' }}>
                      R$ {Number(jogo.preco).toFixed(2)}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        onClick={() => abrirDetalhes(jogo)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid #334155',
                          backgroundColor: '#0f172a',
                          color: '#38bdf8',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        🔎 Ver Detalhes
                      </button>

                      <button
                        onClick={() => !jaPossui && adicionarAoCarrinho(jogo.id)}
                        disabled={jaPossui}
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: jaPossui ? '#334155' : '#0070f3',
                          color: jaPossui ? '#94a3b8' : '#fff',
                          fontWeight: 'bold',
                          cursor: jaPossui ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {jaPossui ? '✓ Já Adquirido' : '🛒 Adicionar ao Carrinho'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {jogoSelecionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #334155',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {jogoSelecionado.Categoria?.nome || 'Indie'}
                </span>
                <h2 style={{ color: '#fff', margin: '0.2rem 0', wordBreak: 'break-word' }}>{jogoSelecionado.titulo || jogoSelecionado.nome}</h2>
              </div>
              <button 
                onClick={() => setJogoSelecionado(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              {jogoSelecionado.descricao || 'Sem descrição informada.'}
            </p>

            <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                💻 Requisitos Mínimos do Sistema
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <div><strong style={{ color: '#f8fafc' }}>SO:</strong> {jogoSelecionado.requisitosMinimos?.so || 'Windows 10'}</div>
                <div><strong style={{ color: '#f8fafc' }}>Processador:</strong> {jogoSelecionado.requisitosMinimos?.processador || 'Intel Core i3'}</div>
                <div><strong style={{ color: '#f8fafc' }}>Memória RAM:</strong> {jogoSelecionado.requisitosMinimos?.memoriaRam || '8 GB'}</div>
                <div><strong style={{ color: '#f8fafc' }}>Placa de Vídeo:</strong> {jogoSelecionado.requisitosMinimos?.placaVideo || 'GTX 1050'}</div>
                <div style={{ gridColumn: 'span 2' }}><strong style={{ color: '#f8fafc' }}>Armazenamento:</strong> {jogoSelecionado.requisitosMinimos?.armazenamento || '5 GB'}</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#eab308', marginTop: 0, marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                ⭐ Avaliações dos Jogadores
              </h4>

              {carregandoAvaliacoes ? (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Carregando avaliações...</p>
              ) : avaliacoes.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Nenhuma avaliação cadastrada ainda. Seja o primeiro a avaliar!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {avaliacoes.map((av, index) => (
                    <div key={av.id || index} style={{ borderBottom: index < avaliacoes.length - 1 ? '1px solid #1e293b' : 'none', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#f8fafc', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {av.Jogador?.nome || av.usuario?.nome || 'Jogador'}
                        </span>
                        <span style={{ color: '#eab308', fontSize: '0.85rem' }}>
                          {'⭐'.repeat(av.nota || 5)} ({av.nota}/5)
                        </span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>
                        "{av.comentario}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
                R$ {Number(jogoSelecionado.preco).toFixed(2)}
              </span>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => setJogoSelecionado(null)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    adicionarAoCarrinho(jogoSelecionado.id);
                    setJogoSelecionado(null);
                  }}
                  disabled={bibliotecaIds.includes(jogoSelecionado.id)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: bibliotecaIds.includes(jogoSelecionado.id) ? '#334155' : '#0070f3',
                    color: bibliotecaIds.includes(jogoSelecionado.id) ? '#94a3b8' : '#fff',
                    fontWeight: 'bold',
                    cursor: bibliotecaIds.includes(jogoSelecionado.id) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {bibliotecaIds.includes(jogoSelecionado.id) ? 'Já Possui' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}