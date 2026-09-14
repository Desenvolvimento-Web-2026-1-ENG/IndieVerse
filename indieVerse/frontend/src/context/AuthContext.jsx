import { createContext, useState, useContext, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem('@indieverse:usuario');
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null; 
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('@indieverse:usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('@indieverse:usuario');
    }
  }, [usuario]);

  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('@indieverse:usuario');
  };

  const excluirPerfilAtual = async () => {
    if (!usuario?.id) return;

    if (usuario.tipo === 'jogador') {
      await usuarioService.deletarJogador(usuario.id);
    } else {
      await usuarioService.deletarDesenvolvedor(usuario.id);
    }

    logout();
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, excluirPerfilAtual }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);