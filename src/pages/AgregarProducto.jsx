import React, { useState } from 'react';
import styles from '../css/AgregarProducto.module.css';

const AgregarProducto = () => {
  const [formulario, setFormulario] = useState({
    Nombre: '',
    Descripcion: '',
    IdCategoria: '',
    Precio: '',
    Stock: '',
    Activo: true,
    FechaRegistro: new Date().toISOString(),
    NombreImagen: '',
    UnidadMedida: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || ' Producto agregado');
        setMostrarModal(true);
        setTimeout(() => setMostrarModal(false), 2500); // Cierra el modal después de 2.5s

        setFormulario({
          Nombre: '',
          Descripcion: '',
          IdCategoria: '',
          Precio: '',
          Stock: '',
          Activo: true,
          FechaRegistro: new Date().toISOString(),
          NombreImagen: '',
          UnidadMedida: ''
        });
      } else {
        setMensaje(` ${data.error || 'Error al agregar producto'}`);
        setMostrarModal(true);
        setTimeout(() => setMostrarModal(false), 3000);
      }
    } catch (error) {
      setMensaje(' Error al conectar con el servidor');
      setMostrarModal(true);
      setTimeout(() => setMostrarModal(false), 3000);
    }
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Agregar Producto</h2>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <input className={styles.input} type="text" name="Nombre" placeholder="Nombre" value={formulario.Nombre} onChange={handleChange} required />
        <input className={styles.input} type="text" name="Descripcion" placeholder="Descripción" value={formulario.Descripcion} onChange={handleChange} />
        <input className={styles.input} type="number" name="IdCategoria" placeholder="ID Categoría" value={formulario.IdCategoria} onChange={handleChange} required />
        <input className={styles.input} type="number" name="Precio" placeholder="Precio" value={formulario.Precio} onChange={handleChange} required />
        <input className={styles.input} type="number" name="Stock" placeholder="Stock" value={formulario.Stock} onChange={handleChange} />
        <input className={styles.input} type="text" name="NombreImagen" placeholder="Nombre de la imagen" value={formulario.NombreImagen} onChange={handleChange} />
        <input className={styles.input} type="text" name="UnidadMedida" placeholder="Unidad de medida" value={formulario.UnidadMedida} onChange={handleChange} required />
        <label className={styles.checkboxLabel}>
          Activo:
          <input className={styles.checkbox} type="checkbox" name="Activo" checked={formulario.Activo} onChange={handleChange} />
        </label>
        <button type="submit" className={styles.boton}>Guardar</button>
      </form>

      {mostrarModal && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <p>{mensaje}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarProducto;
