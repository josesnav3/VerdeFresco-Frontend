import { createContext, useReducer, useContext, useEffect } from 'react';

const ClienteContext = createContext();

const initialState = {
  cliente: null,
  loading: false,
  error: null,
  success: false,
};

const clienteReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTRO_INICIADO':
      return { ...state, loading: true, error: null, success: false };
    case 'REGISTRO_EXITOSO':
    case 'LOGIN_EXITOSO':
      return { ...state, cliente: action.payload, loading: false, success: true };
    case 'REGISTRO_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, cliente: null, loading: false, success: false };
    default:
      return state;
  }
};

export const ClienteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clienteReducer, initialState);

  // ✅ Esto asegura que se cargue el cliente al recargar la página
  useEffect(() => {
    const clienteGuardado = localStorage.getItem("clienteActual");
    if (clienteGuardado) {
      dispatch({ type: "LOGIN_EXITOSO", payload: JSON.parse(clienteGuardado) });
    }
  }, []);

  return (
    <ClienteContext.Provider value={{ state, dispatch }}>
      {children}
    </ClienteContext.Provider>
  );
};

export const useCliente = () => useContext(ClienteContext);

export default ClienteContext;
