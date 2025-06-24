import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/compras.css';

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const clienteActual = JSON.parse(localStorage.getItem("clienteActual"));
  const ID_CLIENTE = clienteActual?.IdCliente;
    
  useEffect(() => {
    if (!ID_CLIENTE) {
      alert("No hay cliente autenticado.");
      return;
    }

    fetch(`http://localhost:3000/api/compras/cliente/${ID_CLIENTE}`)
      .then((res) => res.json())
      .then((data) => setCompras(data))
      .catch((err) => console.error("Error al obtener compras", err));
  }, []);

  const verDetalle = (idCompra) => {
    fetch(`http://localhost:3000/api/compras/detalle/${idCompra}`)
      .then((res) => res.json())
      .then((data) => {
        setCompraSeleccionada(idCompra);
        setDetalle(data);

        const modalEl = document.getElementById("detalleModal");
        const modal = Modal.getOrCreateInstance(modalEl);
        modal.show();
      })
      .catch((err) => console.error("Error al obtener detalle", err));
  };

  return (
    <div
      className="container compras-container overflow-auto"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      <h2>Mis Compras</h2>
      {compras.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        <ul className="list-group">
          {compras.map((c) => (
            <li key={c.IdCompra} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <strong>Compra #{c.IdCompra}</strong><br />
                  Fecha: {new Date(c.Fecha).toLocaleString()}<br />
                  Total: ₡{c.MontoTotal} | Estado: {c.Estado}
                </div>
                <button
                  className="btn btn-outline-primary mt-2 mt-md-0"
                  onClick={() => verDetalle(c.IdCompra)}
                >
                  Ver Detalle
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* MODAL DETALLE */}
      <div
        className="modal fade"
        id="detalleModal"
        tabIndex="-1"
        aria-labelledby="detalleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="detalleModalLabel">
                Detalle de Compra #{compraSeleccionada}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {detalle.length === 0 ? (
                <p>No hay detalle disponible.</p>
              ) : (
                detalle.map((item) => (
                  <div key={item.CodigoProducto} className="mb-2">
                    <strong>{item.Nombre}</strong><br />
                    Cantidad: {item.Cantidad} x ₡{item.PrecioUnitario}<br />
                    <span className="text-muted">Subtotal: ₡{item.Subtotal}</span>
                    <hr />
                  </div>
                ))
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compras;
