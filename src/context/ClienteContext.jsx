import { createContext, useReducer } from 'react';

const ClienteContext = createContext();

const initialState = {
  cliente: null,
  loading: false,
  error: null,
  success: false
};

const clienteReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTRO_INICIADO':
      return { ...state, loading: true, error: null, success: false };
    case 'REGISTRO_EXITOSO':
      return { ...state, loading: false, cliente: action.payload, success: true };
    case 'REGISTRO_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ClienteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clienteReducer, initialState);
  return (
    <ClienteContext.Provider value={{ state, dispatch }}>
      {children}
    </ClienteContext.Provider>
  );
};

export default ClienteContext;
