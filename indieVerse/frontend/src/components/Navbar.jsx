import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ModalPerfil from './ModalPerfil';

export default function Navbar({ telaAtual, setTelaAtual }) {
  const { usuario, excluirPerfilAtual } = useAuth();
  const [excluindo, setExcluindo] = useState(false);
  const [showModalPerfil, setShowModalPerfil] = useState(false);

  const handleTrocarConta = () => {
    setTelaAtual('login');
  };

  const handleExcluirConta = async () => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir permanentemente o perfil "${usuario?.nome}" (${usuario?.tipo?.toUpperCase()})? Esta ação não pode ser desfeita.`
    );

    if (!confirmou) return;

    try {
      setExcluindo(true);
      await excluirPerfilAtual();
      alert('Perfil excluído com sucesso!');
      setTelaAtual('login');
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      alert('Erro ao excluir o perfil do banco de dados.');
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <>
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
            onClick={() => {
              if (usuario) {
                setTelaAtual(usuario.tipo === 'desenvolvedor' ? 'meus-jogos' : 'loja');
              } else {
                setTelaAtual('login');
              }
            }}
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
          {usuario ? (
            usuario.tipo === 'desenvolvedor' ? (
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
            ) : (
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
            )
          ) : null}
        </div>

        <div style={{ flex: '1 1 0%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.6rem' }}>
          {usuario ? (
            <>
              <div
                onClick={() => setShowModalPerfil(true)}
                title="Clique para editar seu perfil"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#1e1b2e',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8b5cf6')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)')}
              >
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>
                  {usuario.tipo === 'desenvolvedor' ? '🛠️' : '🎮'} {usuario.nome}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    backgroundColor: usuario.tipo === 'desenvolvedor' ? '#8b5cf6' : '#0284c7',
                    color: '#ffffff',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '6px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {usuario.tipo}
                </span>
                <span style={{ fontSize: '0.75rem', marginLeft: '0.2rem' }}>✏️</span>
              </div>

              <button
                onClick={handleExcluirConta}
                disabled={excluindo}
                title="Excluir Perfil Logado"
                style={{
                  padding: '0.4rem 0.7rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {excluindo ? '🗑️ Excluindo...' : '🗑️ Excluir'}
              </button>

              <button
                onClick={handleTrocarConta}
                title="Trocar de conta"
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'transparent',
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                🔑 Sair / Entrar
              </button>
            </>
          ) : (
            <button
              onClick={() => setTelaAtual('login')}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              🔑 Entrar / Cadastrar
            </button>
          )}
        </div>
      </nav>

      <ModalPerfil
        show={showModalPerfil}
        onClose={() => setShowModalPerfil(false)}
      />
    </>
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