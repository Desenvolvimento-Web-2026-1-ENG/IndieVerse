import { useEffect } from 'react';

export default function Toast({ mensagem, tipo, onClose }) {
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [mensagem, onClose]);

  if (!mensagem) return null;

  const ehSucesso = tipo === 'sucesso';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: ehSucesso ? '#16a34a' : '#dc2626',
        color: '#fff',
        padding: '0.8rem 1.4rem',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        zIndex: 2000,
        fontWeight: 'bold',
        fontSize: '0.9rem',
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      <span>{ehSucesso ? '✅' : '⚠️'}</span>
      <span>{mensagem}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          marginLeft: '0.5rem',
          fontSize: '1rem'
        }}
      >
        ✕
      </button>
    </div>
  );
}