import { useState, useEffect } from 'react';
import { cadastrarJogoService } from '../services/cadastrarJogoService';

const ESTADO_INICIAL_FORM = {
  titulo: '',
  descricao: '',
  preco: '',
  categoriaId: '',
  so: 'Windows 10',
  processador: 'Intel Core i3',
  memoriaRam: '8GB',
  placaVideo: 'GTX 1050',
  armazenamento: '5GB'
};

export function useCadastrarJogo(usuario, setTelaAtual) {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState(ESTADO_INICIAL_FORM);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await cadastrarJogoService.getCategorias();
      const dados = response.data || [];
      setCategorias(dados);
      
      if (dados.length > 0) {
        setFormData((prev) => ({ ...prev, categoriaId: dados[0].id }));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        desenvolvedorId: usuario?.id,
        categoriaId: parseInt(formData.categoriaId),
        requisitosMinimos: {
          so: formData.so,
          processador: formData.processador,
          memoriaRam: formData.memoriaRam,
          placaVideo: formData.placaVideo,
          armazenamento: formData.armazenamento
        }
      };

      await cadastrarJogoService.cadastrarJogo(payload);
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

  return {
    categorias,
    formData,
    mensagem,
    salvando,
    handleChange,
    handleSubmit
  };
}