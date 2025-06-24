import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const registrarCliente = async (cliente) => {
  const response = await api.post('/clientes/registrar', cliente);
  return response.data;
};
