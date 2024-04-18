import React, { useState } from 'react';
import axios from 'axios';
import './AgregarMateria.css';

function AgregarMateriaComponent() {
  const [nombreMateria, setNombreMateria] = useState('');

  const handleInputChange = (event) => {
    setNombreMateria(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3080/agregarmateria', {
        nombre: nombreMateria
      });
      console.log('Nueva materia agregada:', response.data);
      alert('Materia agregada correctamente.');
      setNombreMateria(''); // Limpiar el campo después de agregar la materia
    } catch (error) {
      console.error('Error al agregar la materia:', error);
      alert('Hubo un error al agregar la materia. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="agregar-materia-container-agregarmateria">
      <h2 className="titulo-agregarmateria">Agregar Nueva Materia</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombreMateria" className="label-agregarmateria">Nombre de la materia:</label>
        <input
          type="text"
          id="nombreMateria"
          value={nombreMateria}
          onChange={handleInputChange}
          className="input-agregarmateria"
          required
        />
        <button className="button-agregarmateria">Agregar Materia</button>
      </form>
    </div>
  );
}

export default AgregarMateriaComponent;
