import { useState, useEffect, useRef } from "react";
import { registrarCliente } from "../api/clienteApi";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/registro.css";

const RegistroCliente = () => {
  const [form, setForm] = useState({
    Nombre: "",
    Correo: "",
    Telefono: "",
    Usuario: "",
    Contrasena: "",
    Metodo2FA: "ninguno",
    IdPais: "",
    IdProvincia: "",
    IdCanton: "",
    IdDistrito: ""
  });

  const [ubicacion, setUbicacion] = useState({
    paises: [],
    provincias: [],
    cantones: [],
    distritos: []
  });

  const [provinciasTotales, setProvinciasTotales] = useState([]);
  const [cantonesTotales, setCantonesTotales] = useState([]);
  const [distritosTotales, setDistritosTotales] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [errores, setErrores] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPoliticas, setShowPoliticas] = useState({ usuario: false, contrasena: false });

  const usuarioRef = useRef(null);
  const contraRef = useRef(null);

  const [politica, setPolitica] = useState({
    usuario: {
      mayuscula: false,
      minuscula: false,
      numero: false,
      especial: false,
    },
    contrasena: {
      mayuscula: false,
      minuscula: false,
      numero: false,
      especial: false,
      longitud: false,
    },
  });

  useEffect(() => {
    axios.get("http://localhost:3000/api/ubicacion/cascada")
      .then(res => {
        setUbicacion(u => ({ ...u, paises: res.data.paises }));
        setProvinciasTotales(res.data.provincias);
        setCantonesTotales(res.data.cantones);
        setDistritosTotales(res.data.distritos);
      })
      .catch(err => {
        console.error("❌ Error cargando ubicación:", err);
      });
  }, []);

  const handleChange = async (e) => {
    let { name, value } = e.target;
    if (["IdPais", "IdProvincia", "IdCanton", "IdDistrito"].includes(name)) {
      value = Number(value);
    }

    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "Usuario") validarUsuario(value);
    if (name === "Contrasena") validarContrasena(value);

    if (name === "IdPais") {
      const id = parseInt(value);
      const provinciasFiltradas = provinciasTotales.filter(p => p.IdPais === id);
      setUbicacion(u => ({
        ...u,
        provincias: provinciasFiltradas,
        cantones: [],
        distritos: []
      }));
      setForm(f => ({ ...f, IdProvincia: "", IdCanton: "", IdDistrito: "" }));
    }

    if (name === "IdProvincia") {
      const id = parseInt(value);
      const cantonesFiltrados = cantonesTotales.filter(c => c.IdProvincia === id);
      setUbicacion(u => ({
        ...u,
        cantones: cantonesFiltrados,
        distritos: []
      }));
      setForm(f => ({ ...f, IdCanton: "", IdDistrito: "" }));
    }

    if (name === "IdCanton") {
      const id = parseInt(value);
      const distritosFiltrados = distritosTotales.filter(d => d.IdCanton === id);
      setUbicacion(u => ({
        ...u,
        distritos: distritosFiltrados
      }));
      setForm(f => ({ ...f, IdDistrito: "" }));
    }
  };

  const validarUsuario = (valor) => {
    setPolitica((prev) => ({
      ...prev,
      usuario: {
        mayuscula: /[A-Z]/.test(valor),
        minuscula: /[a-z]/.test(valor),
        numero: /[0-9]/.test(valor),
        especial: /[!@#$%^&*(),.?":{}|<>]/.test(valor),
      },
    }));
  };

  const validarContrasena = (valor) => {
    setPolitica((prev) => ({
      ...prev,
      contrasena: {
        mayuscula: /[A-Z]/.test(valor),
        minuscula: /[a-z]/.test(valor),
        numero: /[0-9]/.test(valor),
        especial: /[!@#$%^&*(),.?":{}|<>]/.test(valor),
        longitud: valor.length >= 8,
      },
    }));
  };

  const cumplePoliticas = () => {
    const u = Object.values(politica.usuario).every(Boolean);
    const c = Object.values(politica.contrasena).every(Boolean);
    return u && c;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores("");
    setQrUrl("");

    if (!cumplePoliticas()) {
      setIntentos(prev => prev + 1);
      setErrores("❌ No se cumplen las políticas de seguridad.");
      return;
    }

    if (intentos >= 3) {
      setErrores("⚠️ Has superado el número máximo de intentos.");
      return;
    }

    try {
      setLoading(true);

      // Construir dirección con nombres
      const nombrePais = ubicacion.paises.find(p => p.IdPais === form.IdPais)?.Nombre || '';
      const nombreProvincia = provinciasTotales.find(p => p.IdProvincia === form.IdProvincia)?.Nombre || '';
      const nombreCanton = cantonesTotales.find(c => c.IdCanton === form.IdCanton)?.Nombre || '';
      const nombreDistrito = distritosTotales.find(d => d.IdDistrito === form.IdDistrito)?.Nombre || '';
      const direccionCompleta = `${nombrePais}, ${nombreProvincia}, ${nombreCanton}, ${nombreDistrito}`;

      await registrarCliente({
        ...form,
        Direccion: direccionCompleta
      });

      if (form.Metodo2FA === "google") {
        const response = await axios.post("http://localhost:3000/api/clientes/configurar-google", {
          Usuario: form.Usuario,
        });
        setQrUrl(response.data.qr);
      }

      setShowModal(true);
      setIntentos(0);
      setForm({
        Nombre: "",
        Correo: "",
        Telefono: "",
        Usuario: "",
        Contrasena: "",
        Metodo2FA: "ninguno",
        IdPais: "",
        IdProvincia: "",
        IdCanton: "",
        IdDistrito: ""
      });
    } catch (error) {
      setErrores("⚠️ Error en el registro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condicion) =>
    condicion ? (
      <i className="fas fa-check-circle text-success me-2" />
    ) : (
      <i className="fas fa-times-circle text-danger me-2" />
    );

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Registro de Cliente</h2>
      <form className="card p-4 shadow-sm mb-4" onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="Nombre" placeholder="Nombre" value={form.Nombre} onChange={handleChange} required />
        <input className="form-control mb-2" name="Correo" type="email" placeholder="Correo" value={form.Correo} onChange={handleChange} required />
        <input className="form-control mb-2" name="Telefono" placeholder="Teléfono" value={form.Telefono} onChange={handleChange} required />

        <select className="form-control mb-2" name="IdPais" value={form.IdPais} onChange={handleChange} required>
          <option value="">Seleccione un país</option>
          {ubicacion.paises.map(p => (
            <option key={p.IdPais} value={p.IdPais}>{p.Nombre}</option>
          ))}
        </select>

        <select className="form-control mb-2" name="IdProvincia" value={form.IdProvincia} onChange={handleChange} disabled={!form.IdPais} required>
          <option value="">Seleccione una provincia</option>
          {ubicacion.provincias.map(p => (
            <option key={p.IdProvincia} value={p.IdProvincia}>{p.Nombre}</option>
          ))}
        </select>

        <select className="form-control mb-2" name="IdCanton" value={form.IdCanton} onChange={handleChange} disabled={!form.IdProvincia} required>
          <option value="">Seleccione un cantón</option>
          {ubicacion.cantones.map(c => (
            <option key={c.IdCanton} value={c.IdCanton}>{c.Nombre}</option>
          ))}
        </select>

        <select className="form-control mb-3" name="IdDistrito" value={form.IdDistrito} onChange={handleChange} disabled={!form.IdCanton} required>
          <option value="">Seleccione un distrito</option>
          {ubicacion.distritos.map(d => (
            <option key={d.IdDistrito} value={d.IdDistrito}>{d.Nombre}</option>
          ))}
        </select>

        <select className="form-control mb-3" name="Metodo2FA" value={form.Metodo2FA} onChange={handleChange}>
          <option value="ninguno">Sin Doble Autenticación</option>
          <option value="casero">Código enviado</option>
          <option value="google">Google Authenticator</option>
        </select>

        <div onMouseEnter={() => setShowPoliticas(p => ({ ...p, usuario: true }))} onMouseLeave={() => setShowPoliticas(p => ({ ...p, usuario: false }))}>
          <input
            className="form-control mb-2"
            name="Usuario"
            placeholder="Usuario"
            value={form.Usuario}
            onFocus={() => setShowPoliticas(p => ({ ...p, usuario: true }))}
            onBlur={() => setTimeout(() => setShowPoliticas(p => ({ ...p, usuario: false })), 150)}
            onChange={handleChange}
            required
          />
          {showPoliticas.usuario && (
            <div className="card card-body small mb-3 bg-light border-start border-info border-3">
              <strong>Requisitos de Usuario:</strong>
              <p>{renderCheck(politica.usuario.mayuscula)} Mayúscula</p>
              <p>{renderCheck(politica.usuario.minuscula)} Minúscula</p>
              <p>{renderCheck(politica.usuario.numero)} Número</p>
              <p>{renderCheck(politica.usuario.especial)} Carácter especial</p>
            </div>
          )}
        </div>

        <div onMouseEnter={() => setShowPoliticas(p => ({ ...p, contrasena: true }))} onMouseLeave={() => setShowPoliticas(p => ({ ...p, contrasena: false }))}>
          <input
            className="form-control mb-2"
            name="Contrasena"
            type="password"
            placeholder="Contraseña"
            value={form.Contrasena}
            onFocus={() => setShowPoliticas(p => ({ ...p, contrasena: true }))}
            onBlur={() => setTimeout(() => setShowPoliticas(p => ({ ...p, contrasena: false })), 150)}
            onChange={handleChange}
            required
          />
          {showPoliticas.contrasena && (
            <div className="card card-body small mb-3 bg-light border-start border-warning border-3">
              <strong>Requisitos de Contraseña:</strong>
              <p>{renderCheck(politica.contrasena.mayuscula)} Mayúscula</p>
              <p>{renderCheck(politica.contrasena.minuscula)} Minúscula</p>
              <p>{renderCheck(politica.contrasena.numero)} Número</p>
              <p>{renderCheck(politica.contrasena.especial)} Carácter especial</p>
              <p>{renderCheck(politica.contrasena.longitud)} Mínimo 8 caracteres</p>
            </div>
          )}
        </div>

        {errores && <div className="alert alert-danger">{errores}</div>}
        {intentos > 0 && intentos < 3 && (
          <div className="text-danger mb-2">Intentos: {intentos}/3</div>
        )}

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h4 className="text-success mb-2">Registro exitoso</h4>
            <p>Cliente registrado correctamente.</p>
            {qrUrl && (
              <>
                <p className="mt-3"><strong>Escanea este código QR con Google Authenticator:</strong></p>
                <img src={qrUrl} alt="QR Google Authenticator" style={{ width: "180px", margin: "10px auto" }} />
              </>
            )}
            <button className="btn btn-secondary mt-3 w-100" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroCliente;
