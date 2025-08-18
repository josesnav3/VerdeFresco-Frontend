import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCliente } from '../context/ClienteContext'; // Ajusta si la ruta es diferente
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/menu.css';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useCliente();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("clienteActual");
    dispatch({ type: 'LOGOUT' });
    window.dispatchEvent(new Event("cliente-logout"));
    navigate("/login");
  };

  return (
    <nav className="navbar fixed-bottom bg-success d-flex justify-content-around py-2 shadow-lg rounded-top">
      <Link to="/dashboard" className="text-white text-center text-decoration-none">
        <div><i className={`fas fa-seedling ${isActive('/dashboard') ? 'text-warning' : ''}`}></i></div>
        <small>Inicio</small>
      </Link>
      <Link to="/productos" className="text-white text-center text-decoration-none">
        <div><i className={`fas fa-carrot ${isActive('/productos') ? 'text-warning' : ''}`}></i></div>
        <small>Productos</small>
      </Link>
      <Link to="/agregar-producto" className="text-white text-center text-decoration-none">
        <div><i className={`fas fa-globe ${isActive('/agregar-producto') ? 'text-warning' : ''}`}></i></div>
        <small>Mantenimiento</small>
      </Link>
      <button onClick={handleLogout} className="btn btn-link text-white text-center text-decoration-none">
        <div><i className="fas fa-sign-out-alt"></i></div>
        <small>Salir</small>
      </button>
      <Link to="/perfil" className="text-white text-center text-decoration-none">
        <div><i className="fas fa-user"></i></div>
        <small>Perfil</small>
      </Link>
    </nav>
  );
};

export default Menu;
