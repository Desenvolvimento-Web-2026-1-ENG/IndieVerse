import { useAuth } from '../context/AuthContext';
import { useBiblioteca } from '../hooks/useBiblioteca';

export default function Biblioteca() {
  const { usuario } = useAuth();
  const {
    licencas,
    carregando,
    jogoParaAvaliar,
    setJogoParaAvaliar,
    nota,
    setNota,
    comentario,
    setComentario,
    mensagem,
    enviarAvaliacao
  } = useBiblioteca(usuario);

  if (carregando) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }}>
          🎮
        </div>
        <p style={{ fontSize: '1.1rem' }}>Carregando sua biblioteca de jogos...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        borderBottom: '1px solid #334155',
        paddingBottom: '1rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            margin: 0,
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            📚 Minha Biblioteca
          </h1>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
            Acesse seus jogos adquiridos e compartilhe sua opinião com a comunidade.
          </p>
        </div>
        <span style={{
          backgroundColor: '#1e293b',
          color: '#cbd5e1',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          border: '1px solid #334155',
          fontWeight: '600'
        }}>
          {licencas.length} {licencas.length === 1 ? 'Jogo' : 'Jogos'}
        </span>
      </div>

      {mensagem.texto && (
        <div style={{
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          borderRadius: '10px',
          backgroundColor: mensagem.tipo === 'sucesso' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${mensagem.tipo === 'sucesso' ? '#22c55e' : '#ef4444'}`,
          color: mensagem.tipo === 'sucesso' ? '#4ade80' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <span style={{ fontSize: '1.2rem' }}>
            {mensagem.tipo === 'sucesso' ? '✅' : '⚠️'}
          </span>
          {mensagem.texto}
        </div>
      )}

      {licencas.length === 0 ? (
        <div style={{
          backgroundColor: '#1e293b',
          padding: '4rem 2rem',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px dashed #334155',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
            Sua biblioteca está vazia
          </h3>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem', maxWidth: '450px', marginInline: 'auto' }}>
            Explore nossa loja para descobrir novos títulos incríveis e começar sua coleção!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {licencas.map((lic) => {
            const jogo = lic.dadosJogo;
            return (
              <div
                key={lic.id || jogo.id}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  border: '1px solid #334155',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                <div style={{
                  height: '90%',
                  width: '100%',
                  backgroundColor: '#0f172a',
                  backgroundImage: jogo.imagemUrl ? `url(${jogo.imagemUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  padding: '0.75rem',
                  position: 'relative'
                }}>
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.95)',
                    color: '#052e16',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '20px',
                    fontWeight: '800',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    ✓ Licença Ativa
                  </span>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: '#f8fafc',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    lineHeight: '1.3'
                  }}>
                    {jogo.titulo || `Jogo #${jogo.id}`}
                  </h3>

                  <p style={{
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {jogo.descricao || 'Licença ativa associada à sua conta.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#22c55e',
                        color: '#052e16',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
                    >
                      <span style={{ fontSize: '1.1rem' }}>▶</span> Jogar Agora
                    </button>

                    <button
                      onClick={() => setJogoParaAvaliar(jogo)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: '#facc15',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s ease, border-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1e293b';
                        e.currentTarget.style.borderColor = '#eab308';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0f172a';
                        e.currentTarget.style.borderColor = '#334155';
                      }}
                    >
                      <span>⭐</span> Avaliar Jogo
                    </button>
                  </div>
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
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 9999,
          padding: '1rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                padding: '0.6rem',
                borderRadius: '10px',
                color: '#eab308',
                fontSize: '1.25rem'
              }}>
                ⭐
              </div>
              <div>
                <h3 style={{ color: '#f8fafc', margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                  Avaliar Jogo
                </h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>
                  {jogoParaAvaliar.titulo}
                </p>
              </div>
            </div>

            <form onSubmit={enviarAvaliacao} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1', fontWeight: '500' }}>
                  Nota (1 a 5 estrelas)
                </label>
                <select
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Muito Bom)</option>
                  <option value={3}>⭐⭐⭐ (3 - Bom)</option>
                  <option value={2}>⭐⭐ (2 - Regular)</option>
                  <option value={1}>⭐ (1 - Ruim)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1', fontWeight: '500' }}>
                  Sua opinião
                </label>
                <textarea
                  rows="4"
                  required
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escreva detalhes sobre o que achou da jogabilidade, gráficos ou história..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setJogoParaAvaliar(null)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: 'transparent',
                    color: '#cbd5e1',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#eab308',
                    color: '#0f172a',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
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