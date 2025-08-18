import { Routes, Route, Navigate } from 'react-router-dom';
import { useCliente } from './context/ClienteContext';

import RegistroCliente from './pages/RegistroCliente';
import VentaProductos from './pages/VentaProductos';
import Sinpe from './pages/Sinpe'; 

import Dashboard from './pages/Dashboard';
import AgregarProducto from './pages/AgregarProducto';
import FormularioPersona from './pages/ActualizacionDatos'; 
import PagoTarjeta from './pages/PagoTarjeta';

import Compras from './pages/Compras';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Menu from './pages/Menu';
import RecuperarContrasena from "./pages/Autogestion";
import TipoCambio from './pages/tipoCambio';

function App() {
  const { state } = useCliente();
  const autenticado = !!state.cliente;

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={autenticado ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/registro" element={<RegistroCliente />} />

        <Route path="/productos" element={autenticado ? <VentaProductos /> : <Navigate to="/login" />} />
        <Route path="/compras" element={autenticado ? <Compras /> : <Navigate to="/login" />} />
        <Route path="/perfil" element={autenticado ? <Perfil /> : <Navigate to="/login" />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />
        <Route path="/agregar-producto" element={autenticado ? <AgregarProducto /> : <Navigate to="/login" />} />
        <Route path="/persona" element={autenticado ? <FormularioPersona /> : <Navigate to="/login" />} />
        <Route path="/pago-tarjeta" element={autenticado ? <PagoTarjeta /> : <Navigate to="/login" />} />
        <Route path="/tipoCambio" element={autenticado ? <TipoCambio /> : <Navigate to="/login" />} />

        {/* ✅ Ruta corregida */}
        <Route path="/Sinpe" element={autenticado ? <Sinpe /> : <Navigate to="/login" />} />
      </Routes>

      {autenticado && <Menu />}
    </>
  );
}

export default App;
