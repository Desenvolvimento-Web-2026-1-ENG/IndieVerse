import { useAuthPage } from '../hooks/useAuthPage';

export default function LoginRegistro({ setTelaAtual }) {
  const {
    modo,
    setModo,
    tipo,
    setTipo,
    usuariosExistentes,
    usuarioSelecionadoId,
    setUsuarioSelecionadoId,
    carregandoLista,
    formData,
    processando,
    mensagem,
    handleChangeForm,
    handleEntrarComExistente,
    handleCadastrarNovo
  } = useAuthPage(setTelaAtual);

  return (
    <div className="container py-5" style={{ maxWidth: '550px' }}>
      <div className="card bg-dark text-white border-secondary rounded-4 shadow-lg p-4">
        <h2 className="h3 fw-bold text-center mb-4 text-white">
          🔑 Autenticação IndieVerse
        </h2>

        <div className="btn-group w-100 mb-4" role="group">
          <button
            type="button"
            className={`btn fw-semibold ${tipo === 'jogador' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setTipo('jogador')}
          >
            🎮 Jogador
          </button>
          <button
            type="button"
            className={`btn fw-semibold ${tipo === 'desenvolvedor' ? 'btn-purple text-white' : 'btn-outline-secondary'}`}
            style={tipo === 'desenvolvedor' ? { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' } : {}}
            onClick={() => setTipo('desenvolvedor')}
          >
            🛠️ Desenvolvedor / Estúdio
          </button>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-4 pb-2 border-bottom border-secondary">
          <button
            type="button"
            className={`btn btn-link text-decoration-none fw-bold ${modo === 'selecionar' ? 'text-info' : 'text-secondary'}`}
            onClick={() => setModo('selecionar')}
          >
            Selecionar da API
          </button>
          <span className="text-secondary">|</span>
          <button
            type="button"
            className={`btn btn-link text-decoration-none fw-bold ${modo === 'cadastrar' ? 'text-info' : 'text-secondary'}`}
            onClick={() => setModo('cadastrar')}
          >
            Cadastrar Novo
          </button>
        </div>

        {mensagem.texto && (
          <div className={`alert ${mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'}`}>
            {mensagem.texto}
          </div>
        )}

        {modo === 'selecionar' ? (
          <form onSubmit={handleEntrarComExistente} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small text-secondary">
                Selecione um {tipo === 'jogador' ? 'Jogador' : 'Desenvolvedor'} cadastrado no banco:
              </label>
              {carregandoLista ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-info me-2" role="status"></div>
                  <span className="small text-secondary">Buscando do banco...</span>
                </div>
              ) : usuariosExistentes.length === 0 ? (
                <p className="small text-warning">
                  Nenhum {tipo} encontrado no banco. Mude para a aba "Cadastrar Novo" acima!
                </p>
              ) : (
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={usuarioSelecionadoId}
                  onChange={(e) => setUsuarioSelecionadoId(e.target.value)}
                >
                  {usuariosExistentes.map((u) => (
                    <option key={u.id} value={u.id}>
                      ID: {u.id} - {u.nome || u.nomeEstudio} ({u.email || 'Sem e-mail'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={usuariosExistentes.length === 0}
              className="btn btn-primary fw-bold py-2 mt-2"
            >
              Entrar como {tipo === 'jogador' ? 'Jogador' : 'Desenvolvedor'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCadastrarNovo} className="d-flex flex-column gap-3">
            {tipo === 'jogador' ? (
              <div>
                <label className="form-label small text-secondary">Nome do Jogador</label>
                <input
                  type="text"
                  name="nome"
                  required
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Ex: Pedro Henrique"
                  value={formData.nome}
                  onChange={handleChangeForm}
                />
              </div>
            ) : (
              <div>
                <label className="form-label small text-secondary">Nome do Estúdio / Desenvolvedor</label>
                <input
                  type="text"
                  name="nomeEstudio"
                  required
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Ex: Áurea Studios"
                  value={formData.nomeEstudio}
                  onChange={handleChangeForm}
                />
              </div>
            )}

            <div>
              <label className="form-label small text-secondary">E-mail</label>
              <input
                type="email"
                name="email"
                required
                className="form-control bg-dark text-white border-secondary"
                placeholder="dev@exemplo.com"
                value={formData.email}
                onChange={handleChangeForm}
              />
            </div>

            <button
              type="submit"
              disabled={processando}
              className="btn btn-success fw-bold py-2 mt-2"
            >
              {processando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Cadastrando na API...
                </>
              ) : (
                `Cadastrar e Logar como ${tipo === 'jogador' ? 'Jogador' : 'Dev'}`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}