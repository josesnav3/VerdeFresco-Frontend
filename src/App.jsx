import { Routes, Route, Navigate } from 'react-router-dom'; // ✅ NECESARIA

import RegistroCliente from './pages/RegistroCliente';
import VentaProductos from './pages/VentaProductos';
import Dashboard from './pages/Dashboard';
import Compras from './pages/Compras';
import Perfil from './pages/Perfil'; 
import Login from './pages/Login';
import { ClienteProvider } from './context/ClienteContext';
import Menu from './pages/Menu';

function App() {
  // Verificamos si el cliente está autenticado
  const clienteAutenticado = localStorage.getItem("clienteActual");

  return (
    <ClienteProvider>
      <>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              clienteAutenticado ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/registro"
            element={
              clienteAutenticado ? <RegistroCliente /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/productos"
            element={
              clienteAutenticado ? <VentaProductos /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/compras"
            element={
              clienteAutenticado ? <Compras /> : <Navigate to="/login" />
           }

           />

           <Route
             path="/perfil"
             element={
               clienteAutenticado ? <Perfil /> : <Navigate to="/login" />
            }
           />

        </Routes>

        {clienteAutenticado && <Menu />}
      </>
    </ClienteProvider>
  );
}

export default App;
