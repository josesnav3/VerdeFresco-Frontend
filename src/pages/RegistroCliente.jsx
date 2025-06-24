import { useState, useContext } from "react";
import ClienteContext from "../context/ClienteContext";
import { registrarCliente } from "../api/clienteApi";
import "../css/registro.css";

const RegistroCliente = () => {
  const { state, dispatch } = useContext(ClienteContext);

  const [form, setForm] = useState({
    Nombre: "",
    Correo: "",
    Telefono: "",
    Direccion: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "REGISTRO_INICIADO" });

    try {
      const data = await registrarCliente(form);
      dispatch({ type: "REGISTRO_EXITOSO", payload: data });
      setShowModal(true);
      setForm({ Nombre: "", Correo: "", Telefono: "", Direccion: "" });
    } catch (error) {
      dispatch({ type: "REGISTRO_ERROR", payload: error.message });
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-form-container">
        <h2>Registro </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="Correo"
            placeholder="Correo"
            value={form.Correo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Telefono"
            placeholder="Teléfono"
            value={form.Telefono}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Direccion"
            placeholder="Dirección"
            value={form.Direccion}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={state.loading}>
            {state.loading ? "Registrando..." : "Registrar"}
          </button>
          {state.error && <p className="registro-error">Error: {state.error}</p>}
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>✅ Registro exitoso</h3>
            <p>Cliente registrado correctamente.</p>
            <button onClick={() => setShowModal(false)}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroCliente;
