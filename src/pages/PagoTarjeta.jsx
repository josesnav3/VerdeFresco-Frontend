import React, { useState } from 'react';
import styles from '../css/PagoTarjeta.module.css';
import visaLogo from '../images/visa.png';
import mcLogo from '../images/mastercard.png';
import { useNavigate } from 'react-router-dom';

const PagoTarjeta = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    numero: '',
    vencimientoMes: '',
    vencimientoAno: '',
    cvv: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numero' && !/^\d*$/.test(value)) return;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identificacion = localStorage.getItem("identificacionPago");
    const montoTotal = parseFloat(localStorage.getItem("montoTotalCompra"));

    if (!identificacion || isNaN(montoTotal)) {
      mostrarModal("Datos de compra incompletos.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3090/api/clientes/${identificacion}`);
      if (!response.ok) throw new Error("Cliente no encontrado");

      const data = await response.json();
      const saldoDisponible = data.tarjetas?.[0]?.SaldoDisponible || 0;

      if (montoTotal > saldoDisponible) {
        mostrarModal("Saldo insuficiente para completar el pago.");
        return;
      }

      mostrarModal(`Pago exitoso. Monto: ₡${montoTotal}`);
    } catch (error) {
      console.error("Error al validar el saldo:", error);
      mostrarModal("Error al validar el saldo del cliente.");
    }
  };

  const mostrarModal = (mensaje) => {
    setModalMensaje(mensaje);
    setModalVisible(true);
  };

  const cerrarModal = () => setModalVisible(false);

  const irASinpe = () => {
    const id = localStorage.getItem("identificacionPago");
    if (id) localStorage.setItem("identificacion", id);
    navigate("/SINPE");
  };

  const obtenerLogo = () => {
    const primerDigito = formulario.numero.charAt(0);
    if (primerDigito === '1') return visaLogo;
    if (primerDigito === '2') return mcLogo;
    return null;
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.wrapper}>
        <div className={styles.formContainer}>
          <h2 className={styles.titulo}>Información de Pago</h2>

          <div className={styles.tarjeta}>
            <div className={styles.numeroPreview}>
              XXXX XXXX XXXX {formulario.numero.length >= 4 ? formulario.numero.slice(-4) : 'XXXX'}
            </div>
            {obtenerLogo() && (
              <img src={obtenerLogo()} alt="Logo tarjeta" className={styles.logoTarjeta} />
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.formulario}>
            <label>Nombre del Tarjetahabiente</label>
            <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} required />

            <label>Número de Tarjeta</label>
            <input type="text" name="numero" value={formulario.numero} onChange={handleChange} maxLength="16" required />

            <div className={styles.row}>
              <div>
                <label>Mes</label>
                <select name="vencimientoMes" value={formulario.vencimientoMes} onChange={handleChange} required>
                  <option value="">Mes</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Año</label>
                <select name="vencimientoAno" value={formulario.vencimientoAno} onChange={handleChange} required>
                  <option value="">Año</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={2025 + i}>
                      {2025 + i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>CVV</label>
                <input type="text" name="cvv" value={formulario.cvv} onChange={handleChange} maxLength="4" required />
              </div>
            </div>

            <button type="submit" className={styles.btnPrimario}>Pagar</button>
            <button type="button" className={styles.btnSecundario} onClick={irASinpe}>SINPE MOVIL</button>
          </form>
        </div>

        {modalVisible && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <div
                className={`${styles.modalIcon} ${
                  modalMensaje.toLowerCase().includes("error") || modalMensaje.toLowerCase().includes("insuficiente")
                    ? styles.error
                    : styles.success
                }`}
              >
                <i
                  className={`bi ${
                    modalMensaje.toLowerCase().includes("error") || modalMensaje.toLowerCase().includes("insuficiente")
                      ? "bi-x-circle-fill"
                      : "bi-check-circle-fill"
                  }`}
                ></i>
              </div>
              <div className={styles.modalBody}>
                <h3 className={styles.modalTitulo}>
                  {modalMensaje.toLowerCase().includes("error") ? "Algo salió mal" : "Operación exitosa"}
                </h3>
                <p className={styles.modalMensaje}>{modalMensaje}</p>
                <button className={styles.modalBoton} onClick={cerrarModal}>Aceptar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagoTarjeta;
