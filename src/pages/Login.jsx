import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCliente } from "../context/ClienteContext";
import "../css/login.css";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [codigo2FA, setCodigo2FA] = useState("");
  const [mostrar2FA, setMostrar2FA] = useState(false);
  const [tipo2FA, setTipo2FA] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useCliente();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/clientes/login", {
        Usuario: usuario,
        Contrasena: contrasena,
      });

      if (response.data.requiere2FA) {
        setTipo2FA(response.data.metodo);
        setMostrar2FA(true);
      } else if (response.data.cliente || response.data.IdCliente) {
        const cliente = response.data.cliente || response.data;

        if (cliente?.IdCliente) {
          localStorage.setItem("clienteActual", JSON.stringify(cliente));
          dispatch({ type: "LOGIN_EXITOSO", payload: cliente });
          window.dispatchEvent(new Event("cliente-login"));
          navigate("/dashboard");
        } else {
          setError("Error: El servidor no devolvió el cliente.");
        }
      } else {
        setError("Credenciales inválidas.");
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  const handleVerificar2FA = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/clientes/verificar-2fa", {
        Usuario: usuario,
        codigo: codigo2FA,
      });

      if (res.data.mensaje && res.data.cliente?.IdCliente) {
        const cliente = res.data.cliente;

        localStorage.setItem("clienteActual", JSON.stringify(cliente));
        dispatch({ type: "LOGIN_EXITOSO", payload: cliente });
        window.dispatchEvent(new Event("cliente-login"));
        navigate("/dashboard");
      } else {
        setError("Código incorrecto o respuesta inválida.");
      }
    } catch (err) {
      setError("Error al verificar código 2FA.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>

        {error && <p className="error-msg">{error}</p>}

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <p className="register-link">
           <Link to="/recuperar"> Olvide mi contraseña</Link>
        </p>
      </div>

      {mostrar2FA && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setMostrar2FA(false)}>&times;</button>
            <h3>Verificación 2FA</h3>
            <p>Ingresa el código {tipo2FA === "casero" ? "enviado por correo" : "de la app"}</p>
            <form onSubmit={handleVerificar2FA}>
              <input
                type="text"
                placeholder="Código"
                value={codigo2FA}
                onChange={(e) => setCodigo2FA(e.target.value)}
                required
              />
              <button type="submit">Verificar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
