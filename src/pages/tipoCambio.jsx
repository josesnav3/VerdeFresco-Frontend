import React, { useEffect, useState } from "react";
import "../css/tipoCambio.css";
import logoVerdeFresco from "../images/Logo.png"; // ✅ importar la imagen

const TipoCambio = () => {
  const [tipoCambio, setTipoCambio] = useState({ compra: null, venta: null });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/tipo-cambio")
      .then((res) => res.json())
      .then((data) => {
        setTipoCambio(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener tipo de cambio:", err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="tipo-cambio-container container text-center my-">
      <div className="logo-verdefresco">
        <img src={logoVerdeFresco} alt="VerdeFresco" />
      </div>

      {cargando ? (
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      ) : (
        <div className="row justify-content-center mt-4">
          <div className="col-md-4">
            <div className="card shadow tipo-card">
              <div className="card-body">
                <h5 className="card-title"> Compra</h5>
                <p className="card-text valor">
                  ₡ {Number(tipoCambio.compra)?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow tipo-card venta">
              <div className="card-body">
                <h5 className="card-title">Venta</h5>
                <p className="card-text valor">
                  ₡ {Number(tipoCambio.venta)?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipoCambio;
