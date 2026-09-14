import { useAuth } from '../context/AuthContext';
import { useMeusJogos } from '../hooks/useMeusJogos';

export default function MeusJogos({ setTelaAtual }) {
  const { usuario } = useAuth();
  const {
    meusJogos,
    carregando,
    jogoSelecionado,
    avaliacoes,
    carregandoAvaliacoes,
    verAvaliacoes,
    fecharModalAvaliacoes
  } = useMeusJogos(usuario);

  if (carregando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-secondary fs-5">Carregando seus jogos...</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div>
          <h1 className="h2 text-white fw-bold mb-1 d-flex align-items-center gap-2">
            🛠️ Meus Jogos Publicados
          </h1>
          <p className="text-secondary mb-0 small">
            Gerencie seus jogos cadastrados e veja o feedback dos jogadores.
          </p>
        </div>
        <button
          onClick={() => setTelaAtual('cadastrar-jogo')}
          className="btn btn-primary px-4 py-2 fw-bold rounded-3 shadow-sm text-nowrap align-self-start align-self-sm-auto"
          style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }}
        >
          ➕ Publicar Novo Jogo
        </button>
      </div>

      {meusJogos.length === 0 ? (
        <div className="card bg-dark text-white border-secondary text-center p-5 rounded-4 shadow-sm">
          <div className="display-4 mb-3">🎮</div>
          <p className="text-secondary mb-0 fs-5">
            Você ainda não publicou nenhum jogo. Clique em <strong>"Publicar Novo Jogo"</strong> para começar!
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {meusJogos.map((jogo) => (
            <div key={jogo.id} className="col">
              <div className="card bg-dark text-white border-secondary h-100 rounded-3 shadow-sm d-flex flex-column justify-content-between p-3">
                <div className="mb-3">
                  <span className="badge bg-info text-dark fw-bold text-uppercase mb-2">
                    {jogo.Categoria?.nome || 'Indie'}
                  </span>
                  <h3 className="h5 text-white fw-bold mb-2">{jogo.titulo}</h3>
                  <p
                    className="text-secondary small mb-0"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {jogo.descricao || 'Sem descrição.'}
                  </p>
                </div>

                <div>
                  <div className="fs-5 fw-bold mb-3" style={{ color: '#a855f7' }}>
                    R$ {Number(jogo.preco).toFixed(2)}
                  </div>

                  <button
                    onClick={() => verAvaliacoes(jogo)}
                    className="btn btn-outline-warning btn-sm w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  >
                    <span>⭐</span> Ver Avaliações Recebidas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {jogoSelecionado && (
        <div
          style={{
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
          }}
        >
          <div
            className="card bg-dark text-white border-secondary rounded-4 shadow-lg w-100"
            style={{ maxWidth: '550px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
          >
            <div className="card-header border-secondary d-flex justify-content-between align-items-center p-3">
              <h5 className="modal-title h5 text-white fw-bold m-0 d-flex align-items-center gap-2">
                ⭐ Avaliações: <span className="text-warning">{jogoSelecionado.titulo}</span>
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={fecharModalAvaliacoes}
              ></button>
            </div>

            <div className="card-body overflow-auto p-4" style={{ flex: 1 }}>
              {carregandoAvaliacoes ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-warning mb-2" role="status"></div>
                  <p className="text-secondary small mb-0">Carregando avaliações...</p>
                </div>
              ) : avaliacoes.length === 0 ? (
                <p className="text-secondary text-center my-3">
                  Nenhuma avaliação recebida para este jogo ainda.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {avaliacoes.map((av, index) => (
                    <div
                      key={av.id || index}
                      className="p-3 rounded-3 border border-secondary"
                      style={{ backgroundColor: '#0f172a' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-light small">
                          {av.Jogador?.nome || av.usuario?.nome || 'Jogador'}
                        </span>
                        <span className="text-warning small fw-semibold">
                          {'⭐'.repeat(av.nota || 5)} ({av.nota}/5)
                        </span>
                      </div>
                      <p className="text-secondary small mb-0 italic">
                        "{av.comentario}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-footer border-secondary p-3 text-end">
              <button
                onClick={fecharModalAvaliacoes}
                className="btn btn-secondary w-100 fw-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}