import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import "../css/ventaProductos.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const imagenes = import.meta.glob('../images/*', { eager: true });

const VentaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensajeCompra, setMensajeCompra] = useState("");
  const [mostrarMensajeGlobal, setMostrarMensajeGlobal] = useState(false);

  const clienteActual = JSON.parse(localStorage.getItem("clienteActual"));
  const ID_CLIENTE = clienteActual?.IdCliente;
  const ID_USUARIO = 1;

  useEffect(() => {
    if (!ID_CLIENTE) {
      alert("No hay cliente autenticado. Por favor, inicia sesión.");
      return;
    }

    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos", err));

    obtenerCarrito();
  }, []);

  const obtenerCarrito = () => {
    fetch(`http://localhost:3000/api/carrito/${ID_CLIENTE}`)
      .then((res) => res.json())
      .then((data) => setCarrito(data))
      .catch((err) => console.error("Error al obtener carrito", err));
  };

  const agregarAlCarrito = (producto) => {
    fetch("http://localhost:3000/api/carrito/agregar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdCliente: ID_CLIENTE,
        CodigoProducto: producto.CodigoProducto,
        Cantidad: 1,
      }),
    })
      .then((res) => res.json())
      .then(() => obtenerCarrito())
      .catch((err) => console.error("Error al agregar al carrito", err));
  };

  const quitarDelCarrito = (codigoProducto) => {
    fetch("http://localhost:3000/api/carrito/quitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdCliente: ID_CLIENTE,
        CodigoProducto: codigoProducto,
      }),
    })
      .then((res) => res.json())
      .then(() => obtenerCarrito())
      .catch((err) => console.error("Error al quitar del carrito", err));
  };

  const pagarCompra = () => {
    fetch("http://localhost:3000/api/compras/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdCliente: ID_CLIENTE,
        IdUsuario: ID_USUARIO,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMensajeCompra(data.mensaje || "Compra registrada exitosamente");
        setMostrarMensajeGlobal(true);
        obtenerCarrito();

        // Oculta modal visualmente y limpia backdrop
        const modalEl = document.getElementById("carritoModal");
        if (modalEl) {
          const modalInstance = Modal.getInstance(modalEl);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';

        // Oculta mensaje luego de 4 segundos
        setTimeout(() => {
          setMostrarMensajeGlobal(false);
          setMensajeCompra("");
        }, 4000);
      })
      .catch((err) => {
        console.error("Error al registrar la compra", err);
        setMensajeCompra("Error al registrar la compra.");
        setMostrarMensajeGlobal(true);

        setTimeout(() => {
          setMostrarMensajeGlobal(false);
          setMensajeCompra("");
        }, 4000);
      });
  };

  const obtenerRutaImagen = (nombreProducto) => {
    const nombreNormalizado = `${nombreProducto.toLowerCase().trim()}.jpg`;
    const match = Object.entries(imagenes).find(([key]) =>
      key.toLowerCase().endsWith(`/images/${nombreNormalizado}`)
    );
    return match?.[1]?.default || imagenes["../images/default.jpg"]?.default;
  };

  return (
    <div className="contenedor-productos pb-5">
      {/* ✅ Mensaje global en la parte superior */}
      {mostrarMensajeGlobal && (
        <div className="alert alert-success text-center m-3" role="alert">
          {mensajeCompra}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-2 px-3">
        <h1 className="titulo">Tienda Verde Fresco</h1>
        <button
          className="btn btn-outline-success"
          data-bs-toggle="modal"
          data-bs-target="#carritoModal"
        >
          Ver carrito ({carrito.length})
        </button>
      </div>

      <div className="productos-grid-xs">
        {productos.map((producto) => (
          <div key={producto.CodigoProducto} className="producto-mini">
            <img
              src={obtenerRutaImagen(producto.Nombre)}
              alt={producto.Nombre}
              className="img-mini"
            />
            <div className="info-mini">
              <strong>{producto.Nombre}</strong>
              <span className="precio-mini">₡{producto.Precio}</span>
              <button onClick={() => agregarAlCarrito(producto)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DEL CARRITO */}
      <div
        className="modal fade"
        id="carritoModal"
        tabIndex="-1"
        aria-labelledby="carritoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="carritoModalLabel"> Carrito de compras</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {carrito.length === 0 ? (
                <p>No hay productos en el carrito.</p>
              ) : (
                <ul className="list-group">
                  {carrito.map((item) => (
                    <li key={item.CodigoProducto} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.Nombre}</strong><br />
                        <span className="text-muted">Cantidad: {item.Cantidad}</span><br />
                        <span className="text-muted">Precio: ₡{item.Precio}</span><br />
                        <span className="text-muted">Subtotal: ₡{item.Subtotal}</span>
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => quitarDelCarrito(item.CodigoProducto)}
                      >
                        🗑
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              {carrito.length > 0 && (
                <button className="btn btn-success" onClick={pagarCompra}> Pagar</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentaProductos;
