import { useAuth } from '../context/AuthContext';

export default function Navbar({ telaAtual, setTelaAtual }) {
  const { usuario, alternarPerfil } = useAuth();

  const handlePerfilChange = (novoTipo) => {
    alternarPerfil(novoTipo);
    setTelaAtual(novoTipo === 'jogador' ? 'loja' : 'meus-jogos');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.85rem 2rem',
        backgroundColor: '#120e24',
        borderBottom: '1px solid rgba(139, 92, 246, 0.25)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ flex: '1 1 0%', display: 'flex', justifyContent: 'flex-start' }}>
        <div
          style={{
            fontWeight: '800',
            fontSize: '1.4rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            letterSpacing: '-0.5px',
          }}
          onClick={() => setTelaAtual(usuario?.tipo === 'jogador' ? 'loja' : 'meus-jogos')}
        >
          <span>🎮</span>
          <span
            style={{
              background: 'linear-gradient(90deg, #a78bfa 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IndieVerse
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
        {usuario?.tipo === 'jogador' ? (
          <>
            <NavButton ativo={telaAtual === 'loja'} onClick={() => setTelaAtual('loja')}>
              🏬 Loja
            </NavButton>
            <NavButton ativo={telaAtual === 'biblioteca'} onClick={() => setTelaAtual('biblioteca')}>
              📚 Minha Biblioteca
            </NavButton>
            <NavButton ativo={telaAtual === 'carrinho'} onClick={() => setTelaAtual('carrinho')}>
              🛒 Carrinho
            </NavButton>
          </>
        ) : (
          <>
            <NavButton ativo={telaAtual === 'meus-jogos'} onClick={() => setTelaAtual('meus-jogos')}>
              🕹️ Meus Jogos
            </NavButton>
            <NavButton ativo={telaAtual === 'cadastrar-jogo'} onClick={() => setTelaAtual('cadastrar-jogo')} destaque>
              ➕ Publicar Jogo
            </NavButton>
            <NavButton ativo={telaAtual === 'categorias'} onClick={() => setTelaAtual('categorias')}>
              🏷️ Categorias
            </NavButton>
          </>
        )}
      </div>

      <div style={{ flex: '1 1 0%', display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            backgroundColor: '#1e1b2e',
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>
            Modo:
          </span>
          <select
            value={usuario?.tipo || 'jogador'}
            onChange={(e) => handlePerfilChange(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              color: '#a78bfa',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '0 0.2rem',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
            }}
          >
            <option value="jogador" style={{ backgroundColor: '#1e1b2e', color: '#fff' }}>
              🎮 Jogador
            </option>
            <option value="desenvolvedor" style={{ backgroundColor: '#1e1b2e', color: '#fff' }}>
              🛠️ Desenvolvedor
            </option>
          </select>
          <span style={{ fontSize: '0.65rem', color: '#a78bfa', marginLeft: '2px' }}>▼</span>
        </div>
      </div>
    </nav>
  );
}

function NavButton({ children, onClick, ativo, destaque }) {
  let background = 'transparent';
  let color = '#cbd5e1';
  let border = '1px solid transparent';

  if (ativo) {
    background = 'rgba(139, 92, 246, 0.2)';
    color = '#ffffff';
    border = '1px solid #8b5cf6';
  } else if (destaque) {
    background = 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)';
    color = '#ffffff';
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        border: border,
        background: background,
        color: color,
        fontWeight: ativo || destaque ? '700' : '500',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}