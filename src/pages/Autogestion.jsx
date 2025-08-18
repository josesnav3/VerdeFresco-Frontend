import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Autogestion.css"; // Asegúrate de tener este archivo cargado

const renderCheck = (valido) => (
  <span style={{ color: valido ? "green" : "gray" }}>
    {valido ? "✔" : "✖"}
  </span>
);

const RecuperarContrasena = () => {
  const [usuario, setUsuario] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [codigo2FA, setCodigo2FA] = useState("");
  const [mostrar2FA, setMostrar2FA] = useState(false);
  const [tipo2FA, setTipo2FA] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [showPoliticas, setShowPoliticas] = useState({ contrasena: false });
  const [verContrasena, setVerContrasena] = useState(false);

  const navigate = useNavigate();

  const politica = {
    contrasena: {
      mayuscula: /[A-Z]/.test(nuevaContrasena),
      minuscula: /[a-z]/.test(nuevaContrasena),
      numero: /[0-9]/.test(nuevaContrasena),
      especial: /[^A-Za-z0-9]/.test(nuevaContrasena),
      longitud: nuevaContrasena.length >= 8
    }
  };

  const handleSolicitar2FA = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    try {
      const res = await axios.post("http://localhost:3000/api/clientes/solicitar-2fa", {
        Usuario: usuario,
      });

      if (res.data.requiere2FA) {
        setTipo2FA(res.data.metodo);
        setMostrar2FA(true);
      } else {
        setError("Este usuario no tiene 2FA activo.");
      }
    } catch (err) {
      setError("Error al solicitar verificación 2FA.");
    }
  };

  const handleVerificarYRecuperar = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    try {
      const res = await axios.post("http://localhost:3000/api/clientes/verificar-2fa", {
        Usuario: usuario,
        codigo: codigo2FA,
      });

      if (res.data.mensaje) {
        const cambio = await axios.post("http://localhost:3000/api/clientes/cambiar-contrasena", {
          Usuario: usuario,
          NuevaContrasena: nuevaContrasena,
        });

        if (cambio.data.mensaje) {
          setExito("✅ Contraseña actualizada correctamente. Serás redirigido en unos segundos...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setError("No se pudo actualizar la contraseña.");
        }
      } else {
        setError("Código 2FA incorrecto.");
      }
    } catch (err) {
      setError("Error al verificar código o cambiar contraseña.");
    }
  };

  return (
    <div className="autogestion-container">
      <div className="autogestion-card">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSolicitar2FA}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <div
            onMouseEnter={() => setShowPoliticas(p => ({ ...p, contrasena: true }))}
            onMouseLeave={() => setShowPoliticas(p => ({ ...p, contrasena: false }))}
          >
            <div className="position-relative">
              <input
                type={verContrasena ? "text" : "password"}
                className="form-control pe-5"
                placeholder="Nueva contraseña"
                value={nuevaContrasena}
                onFocus={() => setShowPoliticas(p => ({ ...p, contrasena: true }))}
                onBlur={() => setTimeout(() => setShowPoliticas(p => ({ ...p, contrasena: false })), 150)}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setVerContrasena(!verContrasena)}
                tabIndex={-1}
              >
                <i className={`fas ${verContrasena ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {showPoliticas.contrasena && (
              <div className="politicas-box">
                <strong>Requisitos de Contraseña:</strong>
                <p>{renderCheck(politica.contrasena.mayuscula)} Mayúscula</p>
                <p>{renderCheck(politica.contrasena.minuscula)} Minúscula</p>
                <p>{renderCheck(politica.contrasena.numero)} Número</p>
                <p>{renderCheck(politica.contrasena.especial)} Carácter especial</p>
                <p>{renderCheck(politica.contrasena.longitud)} Mínimo 8 caracteres</p>
              </div>
            )}
          </div>

          <button type="submit">Enviar código 2FA</button>
        </form>

        {error && <p className="error-msg">{error}</p>}
        {exito && <p className="success-msg">{exito}</p>}
      </div>

      {mostrar2FA && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setMostrar2FA(false)}>&times;</button>
            <h3>Verificación 2FA</h3>
            <p>Ingresa el código {tipo2FA === "casero" ? "enviado por correo" : "de la app"}</p>

            {!exito ? (
              <form onSubmit={handleVerificarYRecuperar}>
                <input
                  type="text"
                  placeholder="Código"
                  value={codigo2FA}
                  onChange={(e) => setCodigo2FA(e.target.value)}
                  required
                />
                <button type="submit">Verificar y Cambiar</button>
                {error && <p className="error-msg">{error}</p>}
              </form>
            ) : (
              <div className="success-msg">
                <p>{exito}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecuperarContrasena;
