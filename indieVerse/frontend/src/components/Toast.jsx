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
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      <div
        className={`toast show align-items-center text-white border-0 shadow-lg ${
          ehSucesso ? 'bg-success' : 'bg-danger'
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex p-2">
          <div className="toast-body d-flex align-items-center gap-2 fw-semibold">
            <span>{ehSucesso ? '✅' : '⚠️'}</span>
            <span>{mensagem}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}