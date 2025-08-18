import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const local = localStorage.getItem("clienteActual");
    if (!local) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(local);
    if (!parsed?.IdCliente) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/api/clientes/${parsed.IdCliente}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.IdCliente) {
          setCliente(data);
        } else {
          console.error("No se pudo cargar perfil del cliente.");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Error al obtener perfil:", err);
        navigate("/login");
      });
  }, []);

  if (!cliente) return null;

  const formatearFecha = (fechaIso) => {
    const opciones = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(fechaIso).toLocaleString("es-CR", opciones);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-success">Perfil del Cliente</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <p><strong>Nombre:</strong> {cliente.Nombre}</p>
          <p><strong>Correo:</strong> {cliente.Correo}</p>
          <p><strong>Teléfono:</strong> {cliente.Telefono}</p>
          <p><strong>Dirección:</strong> {cliente.Direccion}</p>
          <p><strong>Fecha de Registro:</strong> {formatearFecha(cliente.FechaAlta)}</p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
