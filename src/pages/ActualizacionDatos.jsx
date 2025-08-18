import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ActualizacionDatos.css";

const FormularioPersona = () => {
  const [identificacion, setIdentificacion] = useState("");
  const [persona, setPersona] = useState({
    Nombre: "",
    PrimerApellido: "",
    SegundoApellido: "",
    Sexo: "",
    Provincia: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const buscarPersona = async () => {
    try {
      const response = await fetch(`http://localhost:3080/api/personas/${identificacion}`);
      if (!response.ok) throw new Error("No se encontró la persona");
      const data = await response.json();
      setPersona(data);
      setError("");
    } catch (err) {
      setError("No se pudo encontrar la persona con esa identificación.");
      setPersona({
        Nombre: "",
        PrimerApellido: "",
        SegundoApellido: "",
        Sexo: "",
        Provincia: "",
      });
    }
  };

  const handleChange = (e) => {
    setPersona({ ...persona, [e.target.name]: e.target.value });
  };

 const handleSubmit = () => {
  console.log("Datos actualizados:", persona);
  localStorage.setItem("identificacionPago", identificacion); // Guarda la cédula
  navigate("/pago-tarjeta"); // Redirige al pago
};


  return (
    <div className="formulario-scroll-container">
      <div className="formulario-container">
        <h2>Actualizar Persona</h2>

        <div className="campo">
          <label>Identificación:</label>
          <input
            type="text"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
          />
          <button onClick={buscarPersona}>Buscar</button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="datos-formulario">
          <div className="campo">
            <label>Nombre:</label>
            <input
              type="text"
              name="Nombre"
              value={persona.Nombre}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Primer Apellido:</label>
            <input
              type="text"
              name="PrimerApellido"
              value={persona.PrimerApellido}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Segundo Apellido:</label>
            <input
              type="text"
              name="SegundoApellido"
              value={persona.SegundoApellido}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Sexo:</label>
            <select
              name="Sexo"
              value={persona.Sexo}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div className="campo">
            <label>Provincia:</label>
            <input
              type="text"
              name="Provincia"
              value={persona.Provincia}
              onChange={handleChange}
            />
          </div>

          <button className="btn-listo" onClick={handleSubmit}>Listo</button>
        </div>
      </div>
    </div>
  );
};

export default FormularioPersona;
