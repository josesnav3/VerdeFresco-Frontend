import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/clientes/login", {
        Correo: correo,
        Contrasena: contrasena
      });

      if (response.data && response.data.IdCliente) {
        localStorage.setItem("clienteActual", JSON.stringify(response.data));
        navigate("/dashboard");
      } else {
        setError("Credenciales inválidas.");
      }

    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <button type="submit">Logear</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Enlace a registro */}
        <p className="mt-3">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" style={{ color: "#2e7d32", fontWeight: "bold" }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
