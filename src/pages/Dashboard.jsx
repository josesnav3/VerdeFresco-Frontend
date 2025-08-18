import React from 'react';
import { Link } from 'react-router-dom';
import '../css/dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Dashboard = () => {
  return (
    <div className="vf-dashboard dashboard-container pb-5">
      {/* ===== Propuesta de logo tipográfico arriba ===== */}
      <div className="brand-proposal" aria-label="Propuesta de logo tipográfico">
        <div className="wordmark">VerdeFresco</div>
        <div className="tag">Calidad fresca, directo a tu mesa</div>
      </div>

      {/* ===== Header existente (no se toca funcionalidad) ===== */}
  

      <section className="dashboard-grid">
        <Link to="/productos" className="grid-item">
          <i className="fas fa-carrot"></i>
          <span>Productos</span>
        </Link>

        <Link to="/registro" className="grid-item">
          <i className="fas fa-user-plus"></i>
          <span>Clientes</span>
        </Link>

        <Link to="/productos" className="grid-item">
          <i className="fas fa-shopping-cart"></i>
          <span>Carrito</span>
        </Link>

        <Link to="/login" className="grid-item">
          <i className="fas fa-key"></i>
          <span>Login</span>
        </Link>

        <Link to="/perfil" className="grid-item">
          <i className="fas fa-user"></i>
          <span>Perfil</span>
        </Link>

        <Link to="/compras" className="grid-item">
          <i className="fas fa-file-invoice"></i>
          <span>Facturas</span>
        </Link>

        <Link to="/compras" className="grid-item">
          <i className="fas fa-gear"></i>
          <span>Mantenimiento</span>
        </Link>

        <Link to="/tipoCambio" className="grid-item">
          <i className="fas fa-dollar-sign"></i>
          <span>Tipo Cambio</span>
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
