import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usuarioService } from '../services/usuarioService';

export default function ModalPerfil({ show, onClose }) {
  const { usuario, login } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    nomeEstudio: '',
    email: '',
  });

  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (show && usuario?.id) {
      carregarPerfil();
    }
  }, [show, usuario]);

  const carregarPerfil = async () => {
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });
    try {
      let response;
      if (usuario.tipo === 'jogador') {
        response = await usuarioService.buscarJogadorPorId(usuario.id);
      } else {
        response = await usuarioService.buscarDesenvolvedorPorId(usuario.id);
      }

      const dados = response.data || {};
      setFormData({
        nome: dados.nome || '',
        nomeEstudio: dados.nomeEstudio || '',
        email: dados.email || '',
      });
    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error);
      setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar os dados do perfil.' });
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      if (usuario.tipo === 'jogador') {
        await usuarioService.atualizarJogador(usuario.id, {
          nome: formData.nome,
          email: formData.email,
        });

        login({
          ...usuario,
          nome: formData.nome,
        });
      } else {
        await usuarioService.atualizarDesenvolvedor(usuario.id, {
          nomeEstudio: formData.nomeEstudio,
          email: formData.email,
        });

        login({
          ...usuario,
          nome: formData.nomeEstudio,
        });
      }

      setMensagem({ tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar alterações.' });
    } finally {
      setSalvando(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white border-secondary rounded-4 shadow">
          <div className="modal-header border-secondary">
            <h5 className="modal-title fw-bold">
              ✏️ Editar Perfil ({usuario?.tipo === 'jogador' ? 'Jogador' : 'Desenvolvedor'})
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSalvar}>
            <div className="modal-body">
              {carregando ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-info me-2" role="status"></div>
                  <span>Carregando dados da API (GET por ID)...</span>
                </div>
              ) : (
                <>
                  {mensagem.texto && (
                    <div
                      className={`alert ${
                        mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'
                      } py-2`}
                    >
                      {mensagem.texto}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label text-secondary small">ID do Usuário</label>
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-0"
                      value={usuario?.id || ''}
                      disabled
                    />
                  </div>

                  {usuario?.tipo === 'jogador' ? (
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Nome Completo</label>
                      <input
                        type="text"
                        name="nome"
                        required
                        className="form-control bg-dark text-white border-secondary"
                        value={formData.nome}
                        onChange={handleChange}
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Nome do Estúdio / Dev</label>
                      <input
                        type="text"
                        name="nomeEstudio"
                        required
                        className="form-control bg-dark text-white border-secondary"
                        value={formData.nomeEstudio}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label text-secondary small">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="form-control bg-dark text-white border-secondary"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer border-secondary">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary fw-bold"
                disabled={carregando || salvando}
              >
                {salvando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Salvando (PUT)...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}