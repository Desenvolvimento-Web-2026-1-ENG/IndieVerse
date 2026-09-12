import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CadastrarJogo({ setTelaAtual }) {
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
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
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>🚀 Publicar Novo Jogo</h2>

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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Título do Jogo</label>
          <input
            type="text"
            name="titulo"
            required
            value={formData.titulo}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Descrição</label>
          <textarea
            name="descricao"
            rows="3"
            value={formData.descricao}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              name="preco"
              required
              value={formData.preco}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Categoria</label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#38bdf8' }}>Requisitos Mínimos</h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <input type="text" name="so" placeholder="SO" value={formData.so} onChange={handleChange} style={inputStyle} />
          <input type="text" name="processador" placeholder="Processador" value={formData.processador} onChange={handleChange} style={inputStyle} />
          <input type="text" name="memoriaRam" placeholder="Memória RAM" value={formData.memoriaRam} onChange={handleChange} style={inputStyle} />
          <input type="text" name="placaVideo" placeholder="Placa de Vídeo" value={formData.placaVideo} onChange={handleChange} style={inputStyle} />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '1rem',
            padding: '0.8rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#a855f7',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Salvar e Publicar
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: '#fff'
};