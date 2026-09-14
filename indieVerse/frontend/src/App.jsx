import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Categorias from './components/Categorias';
import Loja from './components/Loja';
import CadastrarJogo from './components/CadastrarJogo';
import Carrinho from './components/Carrinho';
import Biblioteca from './components/Biblioteca';
import MeusJogos from './components/MeusJogos';
import LoginRegistro from './components/LoginRegistro';

function AppConteudo() {
  const { usuario } = useAuth();

  const obterTelaInicial = (usr) => {
    if (!usr) return 'login';
    return usr.tipo === 'desenvolvedor' ? 'meus-jogos' : 'loja';
  };

  const [telaAtual, setTelaAtual] = useState(() => obterTelaInicial(usuario));

  useEffect(() => {
    if (!usuario) {
      setTelaAtual('login');
    }
  }, [usuario]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <Navbar telaAtual={telaAtual} setTelaAtual={setTelaAtual} />
      
      <main style={{ padding: '2rem' }}>
        {telaAtual === 'login' && <LoginRegistro setTelaAtual={setTelaAtual} />}
        {telaAtual === 'loja' && <Loja />}
        {telaAtual === 'categorias' && <Categorias />}
        {telaAtual === 'cadastrar-jogo' && <CadastrarJogo setTelaAtual={setTelaAtual} />}
        {telaAtual === 'carrinho' && <Carrinho setTelaAtual={setTelaAtual} />}
        {telaAtual === 'biblioteca' && <Biblioteca />}
        {telaAtual === 'meus-jogos' && <MeusJogos setTelaAtual={setTelaAtual} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppConteudo />
    </AuthProvider>
  );
}