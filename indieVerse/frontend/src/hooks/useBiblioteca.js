import { useState, useEffect } from 'react';
import { bibliotecaService } from '../services/bibliotecaService';

export function useBiblioteca(usuario) {
  const [licencas, setLicencas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [jogoParaAvaliar, setJogoParaAvaliar] = useState(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (usuario?.id) {
      carregarBiblioteca();
    }
  }, [usuario?.id]);

  const carregarBiblioteca = async () => {
    try {
      setCarregando(true);
      const [resBib, resJogos] = await Promise.all([
        bibliotecaService.getBibliotecaPorUsuario(usuario.id).catch(() => ({ data: [] })),
        bibliotecaService.getJogos().catch(() => ({ data: [] }))
      ]);

      const listaJogos = resJogos.data || [];
      const listaLicencas = resBib.data || [];

      const licencasFormatadas = listaLicencas.map((lic) => {
        const idDoJogo = lic.jogoId || lic.JogoId || lic.Jogo?.id || lic.jogo?.id;
        const jogoEncontrado = listaJogos.find((j) => String(j.id) === String(idDoJogo));

        return {
          ...lic,
          dadosJogo: jogoEncontrado || lic.Jogo || lic.jogo || { id: idDoJogo, titulo: `Jogo #${idDoJogo}` }
        };
      });

      setLicencas(licencasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error);
    } finally {
      setCarregando(false);
    }
  };

  const enviarAvaliacao = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        jogadorId: usuario.id,
        usuarioId: usuario.id,
        jogoId: jogoParaAvaliar.id,
        nota: Number(nota),
        comentario
      };

      await bibliotecaService.enviarAvaliacao(payload);

      setMensagem({ tipo: 'sucesso', texto: '🎉 Avaliação enviada com sucesso!' });
      setJogoParaAvaliar(null);
      setComentario('');
      setNota(5);
      setTimeout(() => setMensagem({ tipo: '', texto: '' }), 4000);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      
      if (error.response?.status === 403) {
        setMensagem({ 
          tipo: 'erro', 
          texto: 'Erro 403: Alterne seu perfil para Jogador no topo da página para enviar a avaliação.' 
        });
      } else {
        setMensagem({ tipo: 'erro', texto: 'Erro ao enviar avaliação. Verifique a conexão com o servidor.' });
      }
    }
  };

  return {
    licencas,
    carregando,
    jogoParaAvaliar,
    setJogoParaAvaliar,
    nota,
    setNota,
    comentario,
    setComentario,
    mensagem,
    enviarAvaliacao
  };
}