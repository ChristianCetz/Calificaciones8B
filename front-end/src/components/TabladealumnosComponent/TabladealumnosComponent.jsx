  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './TabladealumnosComponent.css';

  function TabladealumnosComponent() {
    const [usuariosConCalificaciones, setUsuariosConCalificaciones] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [calificacionesEditadas, setCalificacionesEditadas] = useState({});

    useEffect(() => {
      const obtenerUsuariosConCalificaciones = async () => {
        try {
          const response = await axios.get('http://localhost:3080/usuarios-con-calificaciones');
          setUsuariosConCalificaciones(response.data);
        } catch (error) {
          console.error('Error al obtener los usuarios con calificaciones:', error);
        }
      };

      obtenerUsuariosConCalificaciones();
    }, []);

    const abrirModal = (usuario) => {
      setUsuarioSeleccionado(usuario);
      const calificacionesIniciales = {};
      usuario.calificaciones.forEach((calificacion) => {
        calificacionesIniciales[calificacion.materia] = calificacion.calificacion;
      });
      setCalificacionesEditadas(calificacionesIniciales);
    };

    const cerrarModal = () => {
      setUsuarioSeleccionado(null);
      setCalificacionesEditadas({});
    };

    const actualizarCalificacion = async (calificacionId) => {
      try {
        const usuarioId = usuarioSeleccionado._id;
        await axios.put(`http://localhost:3080/actualizarcalificaciones/${calificacionId}`, {
          calificacion: calificacionesEditadas[calificacionId],
        });

        const updatedUsuarios = usuariosConCalificaciones.map((usuario) => {
          if (usuario._id === usuarioId) {
            const updatedCalificaciones = usuario.calificaciones.map((calif) => {
              if (calif._id === calificacionId) {
                return { ...calif, calificacion: calificacionesEditadas[calificacionId] };
              }
              return calif;
            });
            return { ...usuario, calificaciones: updatedCalificaciones };
          }
          return usuario;
        });
        setUsuariosConCalificaciones(updatedUsuarios);
        alert('La calificación se actualizó correctamente.');
      } catch (error) {
        console.error('Error al actualizar la calificación:', error);
        alert('Hubo un error al actualizar la calificación. Por favor, inténtalo de nuevo.');
      }
    };
    
    const handleCalificacionChange = (materia, value) => {
      setCalificacionesEditadas({
        ...calificacionesEditadas,
        [materia]: value,
      });
    };

    return (
      <div className="calificaciones-container">
        <h2 className="titulo4">Lista de calificaciones</h2>
        {usuariosConCalificaciones.map((usuario) => (
          <div key={usuario._id} className="user-calificaciones-container">
            <table className="lista-calificaciones">
              <thead>
                <tr>
                  <th rowSpan="2">Nombre</th>
                  <th colSpan="3">Materias</th>
                </tr>
              </thead>
              <tbody>
                <tr key={usuario._id}>
                  <td rowSpan={usuario.calificaciones.length + 1}>{usuario.nombre}</td>
                </tr>
                {usuario.calificaciones.map((calificacion, index) => (
                  <tr key={`${usuario._id}-${index}`}>
                    <td>{calificacion.materia}</td>
                    <td>{calificacion.calificacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => abrirModal(usuario)}>Ver detalles</button>
          </div>
        ))}
        {usuarioSeleccionado && (
          <div className="modal">
            <div className="modal-contenido">
              <h2>Detalles del usuario</h2>
              <p>Nombre: {usuarioSeleccionado.nombre}</p>
              {usuarioSeleccionado.calificaciones.map((calificacion, index) => (
                <div key={index}>
                  <p>{calificacion.materia}</p>
                  <input
                    type="number"
                    value={calificacionesEditadas[calificacion._id] || calificacion.calificacion}
                    onChange={(e) => handleCalificacionChange(calificacion._id, e.target.value)}
                  />
                 
                </div>
              ))}
              <button onClick={cerrarModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default TabladealumnosComponent;
