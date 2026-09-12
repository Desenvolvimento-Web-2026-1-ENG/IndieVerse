import { useAuth } from '../context/AuthContext';

export default function Navbar({ telaAtual, setTelaAtual }) {
  const { usuario, alternarPerfil } = useAuth();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#111827', color: '#fff', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setTelaAtual('loja')}>
        🎮 IndieVerse
      </div>

      {/* Links Dinâmicos por Perfil */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {usuario.tipo === 'jogador' ? (
          <>
            <button onClick={() => setTelaAtual('loja')}>Loja</button>
            <button onClick={() => setTelaAtual('biblioteca')}>Minha Biblioteca</button>
            <button onClick={() => setTelaAtual('carrinho')}>🛒 Carrinho</button>
          </>
        ) : (
          <>
            <button onClick={() => setTelaAtual('meus-jogos')}>Meus Jogos</button>
            <button onClick={() => setTelaAtual('cadastrar-jogo')}>+ Publicar Jogo</button>
            <button onClick={() => setTelaAtual('categorias')}>Gerenciar Categorias</button>
          </>
        )}
      </div>

      {/* Selector de Perfil Mock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem' }}>Modo:</span>
        <select 
          value={usuario.tipo} 
          onChange={(e) => setTelaAtual(e.target.value === 'jogador' ? 'loja' : 'meus-jogos') || alternarPerfil(e.target.value)}
          style={{ padding: '0.3rem', borderRadius: '4px' }}
        >
          <option value="jogador">Jogador</option>
          <option value="desenvolvedor">Desenvolvedor</option>
        </select>
      </div>
    </nav>
  );
}