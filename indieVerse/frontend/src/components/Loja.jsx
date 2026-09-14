import { useAuth } from '../context/AuthContext';
import { useLoja } from '../hooks/useLoja';

export default function Loja() {
  const { usuario } = useAuth();
  const {
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
  } = useLoja(usuario);

  if (carregando) return <p className="text-center text-light my-5">Carregando catálogo...</p>;

  return (
    <div className="pb-5">
      <section className="hero-section py-5 px-3 mb-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge rounded-pill mb-3 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid #8b5cf6' }}>
                ❄️ NOVA TEMPORADA INDIE
              </span>
              <h1 className="display-3 fw-bold text-white mb-3">
                O universo dos <br />
                <span className="text-gradient">jogos independentes</span> <br />
                mora aqui.
              </h1>
              <p className="lead mb-4" style={{ maxWidth: '540px', color: '#cbd5e1' }}>
                Milhares de jogos feitos por estúdios pequenos, artistas solo e mentes inquietas. Encontre seu próximo favorito.
              </p>
            </div>
            <div className="col-lg-5 text-center">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
                alt="Banner"
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25"
              />
            </div>
          </div>
        </div>
      </section>

      <div id="destaques" className="container">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <h2 className="h3 fw-bold text-white m-0">🎮 Jogos em Destaque</h2>
          <div className="d-flex align-items-center gap-2">
            <label className="small text-nowrap" style={{ color: '#cbd5e1' }}>Filtrar Categoria:</label>
            <select
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
              className="form-select fw-semibold rounded-3"
              style={{ backgroundColor: '#18122B', color: '#ffffff', borderColor: '#3b0764' }}
            >
              <option value="todas">Todas as Categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {mensagem.texto && (
          <div className={`alert ${mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'} fw-bold`}>
            {mensagem.texto}
          </div>
        )}

        {jogosFiltrados.length === 0 ? (
          <p className="py-4" style={{ color: '#cbd5e1' }}>Nenhum jogo encontrado para esta categoria.</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {jogosFiltrados.map((jogo) => {
              const jaPossui = bibliotecaIds.includes(jogo.id);
              return (
                <div key={jogo.id} className="col">
                  <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-between shadow-lg" style={{ backgroundColor: '#1e1b2e', border: '1px solid #7c3aed', color: '#ffffff' }}>
                    <div>
                      <small className="fw-bold text-uppercase" style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                        {jogo.Categoria?.nome || 'Indie'}
                      </small>
                      <h3 className="h5 text-white my-2 text-truncate">{jogo.titulo || jogo.nome}</h3>
                      <p className="small text-truncate mb-3" style={{ color: '#cbd5e1' }}>
                        {jogo.descricao || 'Sem descrição disponível.'}
                      </p>
                    </div>

                    <div>
                      <div className="h5 text-white fw-bold mb-3">R$ {Number(jogo.preco || 0).toFixed(2)}</div>
                      <div className="d-grid gap-2">
                        <button onClick={() => abrirDetalhes(jogo)} className="btn btn-sm fw-semibold rounded-3" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#e9d5ff', border: '1px solid #8b5cf6' }}>
                          🔎 Ver Detalhes
                        </button>
                        <button
                          onClick={() => !jaPossui && adicionarAoCarrinho(jogo.id)}
                          disabled={jaPossui}
                          className="btn btn-sm fw-bold rounded-3"
                          style={jaPossui ? { backgroundColor: '#334155', color: '#94a3b8', border: 'none' } : { background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)', color: '#ffffff', border: 'none' }}
                        >
                          {jaPossui ? '✓ Já Adquirido' : '🛒 Adicionar ao Carrinho'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {jogoSelecionado && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content text-white rounded-4" style={{ backgroundColor: '#1e1b2e', border: '1px solid #7c3aed' }}>
              <div className="modal-header border-secondary border-opacity-25">
                <div>
                  <small className="fw-bold text-uppercase" style={{ color: '#38bdf8' }}>{jogoSelecionado.Categoria?.nome || 'Indie'}</small>
                  <h5 className="modal-title fw-bold text-white">{jogoSelecionado.titulo || jogoSelecionado.nome}</h5>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={fecharDetalhes}></button>
              </div>
              <div className="modal-body">
                <p className="small" style={{ color: '#cbd5e1' }}>{jogoSelecionado.descricao || 'Sem descrição informada.'}</p>
                <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h6 className="fw-bold" style={{ color: '#38bdf8' }}>💻 Requisitos Mínimos</h6>
                  <div className="row g-2 small" style={{ color: '#cbd5e1' }}>
                    <div className="col-6"><strong>SO:</strong> {jogoSelecionado.requisitosMinimos?.so || 'Windows 10'}</div>
                    <div className="col-6"><strong>RAM:</strong> {jogoSelecionado.requisitosMinimos?.memoriaRam || '8 GB'}</div>
                    <div className="col-6"><strong>CPU:</strong> {jogoSelecionado.requisitosMinimos?.processador || 'Intel Core i3'}</div>
                    <div className="col-6"><strong>GPU:</strong> {jogoSelecionado.requisitosMinimos?.placaVideo || 'GTX 1050'}</div>
                  </div>
                </div>
                <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h6 className="text-warning fw-bold">⭐ Avaliações</h6>
                  {carregandoAvaliacoes ? (
                    <p className="small m-0" style={{ color: '#94a3b8' }}>Carregando...</p>
                  ) : avaliacoes.length === 0 ? (
                    <p className="small m-0" style={{ color: '#94a3b8' }}>Nenhuma avaliação ainda.</p>
                  ) : (
                    avaliacoes.map((av, idx) => (
                      <div key={idx} className="border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                        <div className="d-flex justify-content-between small">
                          <strong>{av.Jogador?.nome || av.usuario?.nome || 'Jogador'}</strong>
                          <span className="text-warning">{'⭐'.repeat(av.nota || 5)}</span>
                        </div>
                        <p className="small fst-italic m-0" style={{ color: '#cbd5e1' }}>"{av.comentario}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="modal-footer border-secondary border-opacity-25 justify-content-between">
                <span className="h4 text-white fw-bold m-0">R$ {Number(jogoSelecionado.preco || 0).toFixed(2)}</span>
                <div>
                  <button className="btn btn-outline-light me-2 rounded-3" onClick={fecharDetalhes}>Fechar</button>
                  <button
                    className="btn fw-bold rounded-3"
                    style={bibliotecaIds.includes(jogoSelecionado.id) ? { backgroundColor: '#334155', color: '#94a3b8', border: 'none' } : { background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)', color: '#ffffff', border: 'none' }}
                    disabled={bibliotecaIds.includes(jogoSelecionado.id)}
                    onClick={() => {
                      adicionarAoCarrinho(jogoSelecionado.id);
                      fecharDetalhes();
                    }}
                  >
                    {bibliotecaIds.includes(jogoSelecionado.id) ? 'Já Possui' : 'Adicionar ao Carrinho'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}