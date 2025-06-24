import React from "react";

const Perfil = () => {
  const cliente = JSON.parse(localStorage.getItem("clienteActual"));

  if (!cliente) {
    return <p>No hay información de usuario disponible.</p>;
  }

  const formatearFecha = (fechaIso) => {
    const opciones = {
      weekday: undefined,
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
      <h2 className="mb-3 text-success"> Perfil del Cliente</h2>
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
