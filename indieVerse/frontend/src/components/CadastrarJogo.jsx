import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CadastrarJogo({ setTelaAtual }) {
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [salvando, setSalvando] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    categoriaId: '',
    so: 'Windows 10',
    processador: 'Intel Core i3',
    memoriaRam: '8GB',
    placaVideo: 'GTX 1050',
    armazenamento: '5GB'
  });

  useEffect(() => {
    buscarCategorias();
  }, []);

  const buscarCategorias = async () => {
    try {
      const response = await axios.get('/api/v1/categorias');
      setCategorias(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => ({ ...prev, categoriaId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        desenvolvedorId: usuario.id,
        categoriaId: parseInt(formData.categoriaId),
        requisitosMinimos: {
          so: formData.so,
          processador: formData.processador,
          memoriaRam: formData.memoriaRam,
          placaVideo: formData.placaVideo,
          armazenamento: formData.armazenamento
        }
      };

      await axios.post('/api/v1/jogos', payload);
      setMensagem({ tipo: 'sucesso', texto: 'Jogo publicado com sucesso!' });
      
      setTimeout(() => {
        setTelaAtual('meus-jogos');
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar jogo:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar o jogo. Verifique os dados.' });
    } finally {
      setSalvando(false);
    }
  };

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
                className="form-select bg-dark text-white border-secondary"
                value={formData.categoriaId}
                onChange={handleChange}
              >
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