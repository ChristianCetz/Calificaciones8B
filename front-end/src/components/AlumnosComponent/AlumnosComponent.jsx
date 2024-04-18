import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlumnosComponent.css';

function AlumnosComponent() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [correo, setCorreo] = useState('');
  const [calificaciones, setCalificaciones] = useState([]);
  const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
  const [mostrarCalificacionesModal, setMostrarCalificacionesModal] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3080/obtenerusuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    obtenerUsuarios();
  }, []);

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombre(usuario.nombre);
    setEdad(usuario.edad);
    setSexo(usuario.genero);
    setCorreo(usuario.correo);
    setMostrarEditarModal(true);
  };

  const cerrarModalEditar = () => {
    setMostrarEditarModal(false);
    setUsuarioSeleccionado(null);
    setNombre('');
    setEdad('');
    setSexo('');
    setCorreo('');
  };

  const abrirModalCalificaciones = async (usuario) => {
    try {
      const response = await axios.get(`http://localhost:3080/obtenercalificaciones?usuarioId=${usuario._id}`);
      const calificacionesConMaterias = await Promise.all(
        response.data.map(async (calificacion) => {
          const materiaResponse = await axios.get(`http://localhost:3080/obtenermaterias/${calificacion.materiaId}`);
          const materia = materiaResponse.data;
          return {
            ...calificacion,
            materia: materia.nombre
          };
        })
      );
      setCalificaciones(calificacionesConMaterias);
      setUsuarioSeleccionado(usuario);
      setMostrarCalificacionesModal(true);
    } catch (error) {
      console.error('Error al obtener calificaciones:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3080/actualizarusuarios/${usuarioSeleccionado._id}`, {
        nombre,
        edad,
        genero: sexo,
        correo,
      });
      const response = await axios.get('http://localhost:3080/obtenerusuarios');
      setUsuarios(response.data);
      cerrarModalEditar();
      alert('Usuario actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Hubo un error al actualizar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  const eliminarUsuarioYCalificaciones = async () => {
    try {
      await axios.delete(`http://localhost:3080/eliminarusuarioycalificaciones/${usuarioSeleccionado._id}`);
      const updatedUsuarios = usuarios.filter(usuario => usuario._id !== usuarioSeleccionado._id);
      setUsuarios(updatedUsuarios);
      alert('Usuario y calificaciones eliminados correctamente.');
      cerrarModalEditar();
      setMostrarModalConfirmacion(false);
    } catch (error) {
      console.error('Error al eliminar usuario y calificaciones:', error);
      alert('Hubo un error al eliminar el usuario y las calificaciones. Por favor, inténtalo de nuevo.');
    }
  };
  

  return (
    <div className="container-Alumnos">
      <h1 className="titulo-Alumnos">Lista de Usuarios</h1>
      <table className="usuarios-table-Alumnos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Sexo</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.edad}</td>
              <td>{usuario.genero}</td>
              <td>{usuario.correo}</td>
              <td>
                <button onClick={() => abrirModalEditar(usuario)} className="editar-button-Alumnos">Editar</button>
                <button onClick={() => abrirModalCalificaciones(usuario)} className="ver-calificaciones-button-Alumnos">Ver Calificaciones</button>
                <button onClick={() => { setUsuarioSeleccionado(usuario); setMostrarModalConfirmacion(true); }} className="eliminar-button-Alumnos">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarEditarModal && usuarioSeleccionado && (
        <div className="modal-Alumnos">
          <div className="modal-contenido-Alumnos">
            <h2 className="modal-titulo-Alumnos">Editar Usuario</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <label>Edad:</label>
              <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} />
              <label>Sexo:</label>
              <input type="text" value={sexo} onChange={(e) => setSexo(e.target.value)} />
              <label>Correo:</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              <button className="guardar-button-Alumnos">Guardar</button>
              <button onClick={cerrarModalEditar} className="cancelar-button-Alumnos">Cancelar</button>
            </form>
          </div>
        </div>
      )}

{mostrarCalificacionesModal && usuarioSeleccionado && (
  <div className="modal-Alumnos">
    <div className="modal-contenido-Alumnos">
      <h2 className="modal-titulo-Alumnos">Calificaciones de {usuarioSeleccionado.nombre}</h2>
      <table className="calificaciones-table-Alumnos">
        <thead>
          <tr>
            <th>ID</th> {/* Nueva columna para mostrar la ID */}
            <th>Materia</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {calificaciones.map((calificacion) => (
            <tr key={calificacion._id}>
              <td>{calificacion._id}</td> {/* Mostrar la ID de la calificación */}
              <td>{calificacion.materia}</td>
              <td>{calificacion.calificacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setMostrarCalificacionesModal(false)} className="cerrar-modal-button-Alumnos">Cerrar</button>
    </div>
  </div>
)}

      {mostrarModalConfirmacion && usuarioSeleccionado && (
        <div className="modal-Alumnos">
          <div className="modal-contenido-Alumnos">
            <h2 className="modal-titulo-Alumnos">Confirmación de eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
            <button onClick={eliminarUsuarioYCalificaciones} className="eliminar-confirmacion-button-Alumnos">Eliminar</button>
            <button onClick={() => setMostrarModalConfirmacion(false)} className="cancelar-confirmacion-button-Alumnos">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlumnosComponent;
