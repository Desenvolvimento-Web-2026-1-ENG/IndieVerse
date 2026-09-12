import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Define o tipo de usuário ('jogador' ou 'desenvolvedor')
  const [usuario, setUsuario] = useState({
    tipo: 'jogador', // Padrão
    id: 1,           // ID fictício para usar nos endpoints de carrinho/biblioteca
    nome: 'Pedro Henrique'
  });

  const alternarPerfil = (novoTipo) => {
    setUsuario({
      tipo: novoTipo,
      id: 1,
      nome: novoTipo === 'jogador' ? 'Pedro Henrique (Jogador)' : 'Aurea Studios (Dev)'
    });
  };

  return (
    <AuthContext.Provider value={{ usuario, alternarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);