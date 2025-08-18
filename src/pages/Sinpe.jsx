import React, { useState, useEffect } from "react";
import styles from "../css/Sinpe.module.css";

const Sinpe = () => {
  const [monto, setMonto] = useState("");
  const [numeroDestino, setNumeroDestino] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pin, setPin] = useState("");
  const [saldoDisponible, setSaldoDisponible] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const identificacion = localStorage.getItem("identificacion");

  useEffect(() => {
    const obtenerDatosCliente = async () => {
      try {
        const res = await fetch(`http://localhost:3090/api/clientes/${identificacion}`);
        const data = await res.json();
        if (data.tarjetas && data.tarjetas.length > 0) {
          setSaldoDisponible(data.tarjetas[0].SaldoDisponible);
        } else {
          setError("No se encontró información de tarjeta.");
        }
      } catch (err) {
        setError("Error al obtener los datos del cliente.");
      }
    };

    if (identificacion) {
      obtenerDatosCliente();
    } else {
      setError("No hay identificación en localStorage.");
    }
  }, [identificacion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const montoNum = parseFloat(monto);
    if (!numeroDestino || !descripcion || !pin || isNaN(montoNum)) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (montoNum > saldoDisponible) {
      setError("El monto excede el saldo disponible.");
      return;
    }

    setMensaje("Transferencia enviada correctamente.");
    // Aquí podrías llamar a tu API para realizar la transferencia
  };

  return (
    <div className={styles["transferencia-container"]}>
      <h2>SINPE MOVIL</h2>
      {saldoDisponible !== null && (
        <p className={styles.saldo}>Saldo Disponible: ₡{saldoDisponible.toLocaleString()}</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Número destino"
          value={numeroDestino}
          onChange={(e) => setNumeroDestino(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Enviar</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default Sinpe;
