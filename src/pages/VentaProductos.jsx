import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCliente } from "../context/ClienteContext";
import "../css/ventaProductos.css";
import "bootstrap/dist/css/bootstrap.min.css";

const imagenes = import.meta.glob("../images/*", { eager: true });

const VentaProductos = () => {
  const navigate = useNavigate();
  const { state } = useCliente();

  const [cliente, setCliente] = useState(state.cliente || null);
  const ID_USUARIO = 1;

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensajeCompra, setMensajeCompra] = useState("");
  const [mostrarMensajeGlobal, setMostrarMensajeGlobal] = useState(false);
  
  // Estado para controlar el modal personalizado
  const [showModal, setShowModal] = useState(false);

  // Toast/snackbar
  const [toast, setToast] = useState({ show: false, msg: "", type: "ok" });
  const showToast = (msg, type = "ok") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  };

  // Ref al botón de carrito (para animación fly-to-cart)
  const cartBtnRef = useRef(null);

  useEffect(() => {
    let user = state.cliente;

    if (!user) {
      const local = localStorage.getItem("clienteActual");
      if (!local) {
        navigate("/login");
        return;
      }
      user = JSON.parse(local);
    }

    if (!user?.IdCliente) {
      navigate("/login");
      return;
    }

    setCliente(user);

    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos", err));

    fetch(`http://localhost:3000/api/carrito/${user.IdCliente}`)
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setCarrito(data) : setCarrito([])))
      .catch((err) => {
        console.error("Error al obtener carrito", err);
        setCarrito([]);
      });
  }, []);

  const obtenerCarrito = () => {
    if (!cliente) return;
    fetch(`http://localhost:3000/api/carrito/${cliente.IdCliente}`)
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setCarrito(data) : setCarrito([])))
      .catch((err) => {
        console.error("Error al obtener carrito", err);
        setCarrito([]);
      });
  };

  // Animación fly-to-cart (imagen vuela hacia el botón "Ver carrito")
  const animateFly = (imgEl) => {
    try {
      const cartBtn = cartBtnRef.current;
      if (!imgEl || !cartBtn) return;

      const imgRect = imgEl.getBoundingClientRect();
      const cartRect = cartBtn.getBoundingClientRect();

      const flying = imgEl.cloneNode(true);
      flying.classList.add("flying-img");
      document.body.appendChild(flying);

      // Posición inicial (coordenadas absolutas)
      flying.style.left = `${imgRect.left}px`;
      flying.style.top = `${imgRect.top}px`;
      flying.style.width = `${imgRect.width}px`;
      flying.style.height = `${imgRect.height}px`;

      // Forzar reflow
      // eslint-disable-next-line no-unused-expressions
      flying.offsetWidth;

      // Animación hacia el botón del carrito
      flying.style.transform = `translate(${cartRect.left - imgRect.left + cartRect.width / 2 - imgRect.width / 2}px, ${cartRect.top - imgRect.top + cartRect.height / 2 - imgRect.height / 2}px) scale(0.2)`;
      flying.style.opacity = "0.3";

      flying.addEventListener(
        "transitionend",
        () => {
          flying.remove();
          // Bump en el botón de carrito
          cartBtn.classList.remove("bump");
          // Forzar reflow para reiniciar animación
          // eslint-disable-next-line no-unused-expressions
          cartBtn.offsetWidth;
          cartBtn.classList.add("bump");
        },
        { once: true }
      );
    } catch (e) {
      // Silent: animación no debe romper el flujo
      console.warn("Animación no disponible:", e);
    }
  };

  // ✅ FIX: guardar referencia del botón ANTES del fetch
  const agregarAlCarrito = (producto, e) => {
    if (!cliente) return;

    const btnEl = e?.currentTarget || null; // guardamos el DOM node del botón

    fetch("http://localhost:3000/api/carrito/agregar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdCliente: cliente.IdCliente,
        CodigoProducto: producto.CodigoProducto,
        Cantidad: 1,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        obtenerCarrito();

        // Usamos la referencia guardada (no el evento)
        const card = btnEl?.closest(".producto-mini") || null;
        if (card) {
          card.classList.add("added");
          setTimeout(() => card.classList.remove("added"), 800);
          const imgEl = card.querySelector("img");
          animateFly(imgEl);
        }

        showToast(`Agregado: ${producto.Nombre}`, "ok");
      })
      .catch((err) => console.error("Error al agregar al carrito", err));
  };

  const quitarDelCarrito = (codigoProducto, nombre = "") => {
    if (!cliente) return;
    fetch("http://localhost:3000/api/carrito/quitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdCliente: cliente.IdCliente,
        CodigoProducto: codigoProducto,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        obtenerCarrito();
        showToast(`Eliminado: ${nombre || codigoProducto}`, "warn");
      })
      .catch((err) => console.error("Error al quitar del carrito", err));
  };

  const pagarCompra = () => {
    if (!cliente) return;
    
    // Cerrar modal primero
    setShowModal(false);
    
    // Navegar a la página de pago
    const total = carrito.reduce((sum, item) => sum + item.Subtotal, 0);
    localStorage.setItem("montoTotalCompra", total);
    navigate("/persona");
  };

  const obtenerRutaImagen = (nombreProducto) => {
    const nombreNormalizado = `${nombreProducto.toLowerCase().trim()}.jpg`;
    const match = Object.entries(imagenes).find(([key]) =>
      key.toLowerCase().endsWith(`/images/${nombreNormalizado}`)
    );
    return match?.[1]?.default || imagenes["../images/default.jpg"]?.default;
  };

  // Calcular total del carrito
  const totalCarrito = Array.isArray(carrito) 
    ? carrito.reduce((sum, item) => sum + item.Subtotal, 0)
    : 0;

  return (
    <div className="vf-venta contenedor-productos pb-5">
      {/* Snackbar/Toast minimalista */}
      <div className={`vf-snackbar ${toast.show ? "show" : ""} ${toast.type}`}>
        {toast.msg}
      </div>

      {mostrarMensajeGlobal && (
        <div className="alert alert-success text-center m-3" role="alert">
          {mensajeCompra}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-2 px-3">
        <h1 className="titulo">Tienda Verde Fresco</h1>
        <button
          ref={cartBtnRef}
          className="btn btn-outline-success btn-cart"
          onClick={() => setShowModal(true)}
          type="button"
          aria-label="Ver carrito"
        >
          <i className="fas fa-shopping-cart me-2"></i>
          Ver carrito ({Array.isArray(carrito) ? carrito.length : 0})
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
              <strong className="nombre">{producto.Nombre}</strong>
              <p className="mb-1 descripcion">{producto.Descripcion}</p>
              <span className="precio-mini">₡{producto.Precio}</span>
              <button onClick={(e) => agregarAlCarrito(producto, e)} title="Agregar">
                <i className="fas fa-plus"></i>
              </button>
              <span className="added-badge">
                <i className="fas fa-check"></i> Agregado
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PERSONALIZADO DEL CARRITO */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div 
            className="vf-modal-backdrop"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="vf-modal">
            <div className="vf-bottom-sheet">
              <div className="modal-content">
                {/* Header */}
                <div className="vf-modal-header d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="cesto">
                      <i className="fas fa-shopping-basket"></i>
                    </div>
                    <h5 className="modal-title mb-0">Mi Carrito</h5>
                  </div>
                  <button
                    type="button"
                    className="btn-cerrar"
                    onClick={() => setShowModal(false)}
                    aria-label="Cerrar"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {/* Body */}
                <div className="vf-modal-body">
                  {Array.isArray(carrito) && carrito.length === 0 ? (
                    <div className="carrito-vacio">
                      <i className="fas fa-shopping-cart"></i>
                      <p className="mb-0 mt-2">Tu carrito está vacío</p>
                      <small>Agrega productos para comenzar</small>
                    </div>
                  ) : (
                    <div className="vf-cart-list">
                      <ul className="list-group list-group-flush">
                        {carrito.map((item) => (
                          <li
                            key={item.CodigoProducto}
                            className="list-group-item carrito-item"
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="item-info flex-grow-1">
                                <strong>{item.Nombre}</strong>
                                <div className="mini-datos">
                                  <span>Cantidad: {item.Cantidad}</span>
                                  <span>Precio: ₡{item.Precio}</span>
                                  <span className="sub">Subtotal: ₡{item.Subtotal}</span>
                                </div>
                              </div>
                              <button
                                className="btn btn-sm btn-remove ms-3"
                                onClick={(e) => {
                                  // Pre-animación de salida
                                  const li = e.currentTarget.closest(".carrito-item");
                                  if (li) {
                                    li.classList.add("removing");
                                    setTimeout(
                                      () => quitarDelCarrito(item.CodigoProducto, item.Nombre),
                                      250
                                    );
                                  } else {
                                    quitarDelCarrito(item.CodigoProducto, item.Nombre);
                                  }
                                }}
                                title="Eliminar del carrito"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Summary Bar */}
                {Array.isArray(carrito) && carrito.length > 0 && (
                  <div className="vf-summary">
                    <span className="etiqueta">Total a pagar:</span>
                    <span className="monto">₡{totalCarrito.toFixed(2)}</span>
                  </div>
                )}

                {/* Footer */}
                <div className="vf-modal-footer d-flex gap-2 p-3">
                  <button 
                    className="btn btn-secondary flex-fill" 
                    onClick={() => setShowModal(false)}
                  >
                    Seguir comprando
                  </button>

                  {Array.isArray(carrito) && carrito.length > 0 && (
                    <button
                      className="btn btn-pagar flex-fill"
                      onClick={pagarCompra}
                    >
                      <i className="fas fa-credit-card me-2"></i>
                      Proceder al pago
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VentaProductos;