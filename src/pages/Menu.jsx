import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/menu.css';

const Menu = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar fixed-bottom bg-success d-flex justify-content-around py-2 shadow-lg rounded-top">
      <Link to="/dashboard" className="text-white text-center text-decoration-none">
        <div><i className={`fas fa-seedling ${isActive('/dashboard') || isActive('/dashboard') ? 'text-warning' : ''}`}></i></div>
        <small>Inicio</small>
      </Link>
      <Link to="/productos" className="text-white text-center text-decoration-none">
        <div><i className={`fas fa-carrot ${isActive('/productos') ? 'text-warning' : ''}`}></i></div>
        <small>Productos</small>
      </Link>
      <Link to="#" className="text-white text-center text-decoration-none">
        <div><i className={`fas fa-home ${isActive('#') ? 'text-warning' : ''}`}></i></div>
        <small></small>
      </Link>
      <Link to="/login" className="text-white text-center text-decoration-none">
        <div><i className="fas fa-key"></i></div>
        <small>Login</small>
      </Link>
      <Link to="/perfil" className="text-white text-center text-decoration-none">
        <div><i className="fas fa-user"></i></div>
        <small>Perfil</small>
      </Link>
    </nav>
  );
};

export default Menu;
