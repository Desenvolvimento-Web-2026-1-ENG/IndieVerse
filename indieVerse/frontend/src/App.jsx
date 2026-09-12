import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Categorias from './components/Categorias';
import Loja from './components/Loja';
import CadastrarJogo from './components/CadastrarJogo';
import Carrinho from './components/Carrinho';
import Biblioteca from './components/Biblioteca';
import MeusJogos from './components/MeusJogos'; 

function AppConteudo() {
  const [telaAtual, setTelaAtual] = useState('loja');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <Navbar telaAtual={telaAtual} setTelaAtual={setTelaAtual} />
      
      <main style={{ padding: '2rem' }}>
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