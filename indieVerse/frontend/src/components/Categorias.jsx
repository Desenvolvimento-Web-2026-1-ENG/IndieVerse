import React from 'react';
import { useCategorias } from '../hooks/useCategorias';

export default function Categorias() {
  const {
    categorias,
    nome,
    editandoId,
    carregando,
    salvando,
    setNome,
    salvar,
    editar,
    cancelarEdicao,
    deletar
  } = useCategorias();

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <h2 className="h3 text-white fw-bold mb-4 d-flex align-items-center gap-2">
        🏷️ Gerenciar Categorias
      </h2>

      <div className="card bg-dark text-white border-secondary rounded-4 shadow-lg p-4 mb-4">
        <h5 className="h6 text-secondary text-uppercase fw-bold mb-3">
          {editandoId ? '✏️ Editar Categoria' : '➕ Cadastrar Nova Categoria'}
        </h5>

        <form onSubmit={salvar}>
          <div className="row g-2 align-items-center">
            <div className="col">
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Nome da Categoria (ex: Ação, RPG, Indie)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="col-auto d-flex gap-2">
              <button
                type="submit"
                disabled={salvando}
                className={`btn ${editandoId ? 'btn-warning text-dark' : 'btn-primary'} fw-semibold d-flex align-items-center gap-2`}
              >
                {salvando ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Salvando...
                  </>
                ) : (
                  editandoId ? 'Atualizar' : 'Cadastrar'
                )}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary fw-semibold"
                  onClick={cancelarEdicao}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="card bg-dark text-white border-secondary rounded-4 shadow-lg overflow-hidden">
        <div className="card-header border-secondary p-3 bg-dark">
          <h5 className="h6 text-white fw-bold m-0">Categorias Cadastradas</h5>
        </div>

        {carregando ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="text-secondary small mb-0">Carregando categorias...</p>
          </div>
        ) : categorias.length === 0 ? (
          <div className="p-4 text-center text-secondary">
            Nenhuma categoria cadastrada até o momento.
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center p-3"
              >
                <span className="fw-medium text-light">{cat.nome}</span>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-warning fw-semibold px-3"
                    onClick={() => editar(cat)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger fw-semibold px-3"
                    onClick={() => deletar(cat.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}