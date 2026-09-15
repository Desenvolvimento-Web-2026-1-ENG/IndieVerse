import { useAuth } from '../context/AuthContext';
import { useCadastrarJogo } from '../hooks/useCadastrarJogo';

export default function CadastrarJogo({ setTelaAtual }) {
  const { usuario } = useAuth();
  const {
    categorias,
    formData,
    mensagem,
    salvando,
    handleChange,
    handleSubmit
  } = useCadastrarJogo(usuario, setTelaAtual);

  return (
    <div className="container py-4" style={{ maxWidth: '650px' }}>
      <div className="card bg-dark text-white border-secondary rounded-4 shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
          <h2 className="h3 text-white fw-bold m-0 d-flex align-items-center gap-2">
            🚀 Publicar Novo Jogo
          </h2>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setTelaAtual('meus-jogos')}
          >
            Cancelar
          </button>
        </div>

        {mensagem.texto && (
          <div
            className={`alert ${
              mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'
            } alert-dismissible fade show`}
            role="alert"
          >
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-light fw-semibold small">Título do Jogo</label>
            <input
              type="text"
              name="titulo"
              required
              className="form-control bg-dark text-white border-secondary"
              placeholder="Ex: Stardew Valley"
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label text-light fw-semibold small">Descrição</label>
            <textarea
              name="descricao"
              rows="3"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Descreva brevemente a proposta do seu jogo..."
              value={formData.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-light fw-semibold small">Preço (R$)</label>
              <div className="input-group">
                <span className="input-group-text bg-secondary text-white border-secondary">R$</span>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  required
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="0.00"
                  value={formData.preco}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label text-light fw-semibold small">Categoria</label>
              <select
                name="categoriaId"
                required
                className="form-select bg-dark text-white border-secondary"
                value={formData.categoriaId}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-2">
            <h5 className="h6 text-info fw-bold mb-3 d-flex align-items-center gap-2">
              💻 Requisitos Mínimos
            </h5>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="text"
                  name="so"
                  placeholder="Sistema Operacional"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  value={formData.so}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  name="processador"
                  placeholder="Processador"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  value={formData.processador}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  name="memoriaRam"
                  placeholder="Memória RAM"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  value={formData.memoriaRam}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  name="placaVideo"
                  placeholder="Placa de Vídeo"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  value={formData.placaVideo}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="btn btn-primary btn-lg w-100 fw-bold mt-3 shadow-sm"
            style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }}
          >
            {salvando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Publicando...
              </>
            ) : (
              'Salvar e Publicar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}