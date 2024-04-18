import './ActualizarMateria.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ActualizarMateria() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerMaterias = async () => {
      try {
        const response = await axios.get('http://localhost:3080/obtenermaterias');
        setMaterias(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las materias:', error);
      }
    };

    obtenerMaterias();
  }, []);

  const handleNombreChange = (event, materiaId) => {
    const nombre = event.target.value;
    setMaterias((prevMaterias) =>
      prevMaterias.map((materia) =>
        materia._id === materiaId ? { ...materia, nombre } : materia
      )
    );
  };

  const handleActualizar = async (materiaId) => {
    try {
      const materia = materias.find((m) => m._id === materiaId);
      await axios.put(`http://localhost:3080/actualizarmaterias/${materiaId}`, materia);
      alert('Materia actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la materia:', error);
    }
  };

  if (loading) {
    return <div className="actualizar-materia-loading">Cargando...</div>;
  }

  return (
    <div className="actualizar-materia-container">
      <h2 className="actualizar-materia-title">Actualizar Materias</h2>
      <table className="actualizar-materia-table">
        <thead>
          <tr>
            <th className="actualizar-materia-header">ID</th>
            <th className="actualizar-materia-header">Nombre</th>
            <th className="actualizar-materia-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((materia) => (
            <tr key={materia._id} className="actualizar-materia-row">
              <td className="actualizar-materia-data">{materia._id}</td>
              <td className="actualizar-materia-data">
                <input
                  type="text"
                  value={materia.nombre}
                  onChange={(e) => handleNombreChange(e, materia._id)}
                  className="actualizar-materia-input"
                />
              </td>
              <td className="actualizar-materia-data">
                <button onClick={() => handleActualizar(materia._id)} className="actualizar-materia-button">
                  Actualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActualizarMateria;
