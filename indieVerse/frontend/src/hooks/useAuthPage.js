import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';

export function useAuthPage(setTelaAtual) {
  const { login } = useAuth();

  const [modo, setModo] = useState('selecionar');
  const [tipo, setTipo] = useState('jogador'); 

  const [usuariosExistentes, setUsuariosExistentes] = useState([]);
  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState('');
  const [carregandoLista, setCarregandoLista] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    nomeEstudio: ''
  });
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (modo === 'selecionar') {
      carregarUsuarios();
    }
  }, [tipo, modo]);

  const carregarUsuarios = async () => {
    setCarregandoLista(true);
    try {
      const response = tipo === 'jogador' 
        ? await usuarioService.listarJogadores()
        : await usuarioService.listarDesenvolvedores();

      const lista = response.data || [];
      setUsuariosExistentes(lista);
      if (lista.length > 0) {
        setUsuarioSelecionadoId(lista[0].id);
      } else {
        setUsuarioSelecionadoId('');
      }
    } catch (error) {
      console.error('Erro ao carregar lista de usuários:', error);
    } finally {
      setCarregandoLista(false);
    }
  };

  const handleChangeForm = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEntrarComExistente = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuariosExistentes.find(u => String(u.id) === String(usuarioSelecionadoId));
    
    if (!usuarioEncontrado) {
      setMensagem({ tipo: 'erro', texto: 'Selecione uma conta válida.' });
      return;
    }

    login({
      tipo,
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome || usuarioEncontrado.nomeEstudio || 'Usuário'
    });

    setMensagem({ tipo: 'sucesso', texto: `Entrou como ${tipo.toUpperCase()}!` });
    
    const próximaTela = tipo === 'desenvolvedor' ? 'meus-jogos' : 'loja';
    setTimeout(() => setTelaAtual(próximaTela), 500);
  };

  const handleCadastrarNovo = async (e) => {
    e.preventDefault();
    setProcessando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      let response;
      if (tipo === 'jogador') {
        response = await usuarioService.cadastrarJogador({
          nome: formData.nome,
          email: formData.email
        });
      } else {
        response = await usuarioService.cadastrarDesenvolvedor({
          nomeEstudio: formData.nomeEstudio || formData.nome,
          email: formData.email
        });
      }

      const novoUsuario = response.data;

      login({
        tipo,
        id: novoUsuario.id,
        nome: novoUsuario.nome || novoUsuario.nomeEstudio || formData.nome
      });

      setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso!' });

      const próximaTela = tipo === 'desenvolvedor' ? 'meus-jogos' : 'loja';
      setTimeout(() => setTelaAtual(próximaTela), 500);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao criar conta. Verifique os campos.' });
    } finally {
      setProcessando(false);
    }
  };

  return {
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
  };
}