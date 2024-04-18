import "./TablaMateriaComponent.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TablaMateriaComponent() { 
    const [alumnos, setAlumnos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
    const[calificacion, setCalificacion] = useState('');

    useEffect(() => {
        // Obtener lista de alumnos
        axios.get('http://localhost:3080/obtenerusuarios?rol=alumno')
            .then(response => {
                setAlumnos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la lista de alumnos:', error);
            });

        // Obtener lista de materias
        axios.get('http://localhost:3080/obtenermaterias')
            .then(response => {
                setMaterias(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la lista de materias:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!alumnoSeleccionado || !materiaSeleccionada || !calificacion) {
            alert('Por favor selecciona un alumno y una materia.');
            return;
        }

        try {
            await axios.post('http://localhost:3080/agregarcalificaciones', {
                materiaId: materiaSeleccionada,
                usuarioId: alumnoSeleccionado,
                calificacion: calificacion // Puedes agregar una calificación si es necesario
            });
            alert('Materia agregada al alumno exitosamente.');
        } catch (error) {
            console.error('Error al agregar materia al alumno:', error);
            alert('Error al agregar materia al alumno. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="tabla-materia-container">
        <h2 className="titulo">Agregar Materia a Alumno</h2>
        <form className="formulario" onSubmit={handleSubmit}>
          <div>
            <label className="label">Selecciona un alumno:</label>
            <select className="select" value={alumnoSeleccionado} onChange={(e) => setAlumnoSeleccionado(e.target.value)}>
              <option value="">Selecciona un alumno</option>
              {alumnos.map(alumno => (
                <option key={alumno._id} value={alumno._id}>{alumno.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Selecciona una materia:</label>
            <select className="select" value={materiaSeleccionada} onChange={(e) => setMateriaSeleccionada(e.target.value)}>
              <option value="">Selecciona una materia</option>
              {materias.map(materia => (
                <option key={materia._id} value={materia._id}>{materia.nombre}</option>
              ))}
            </select>
          </div>
          <div>
                    <label className="label">Ingrese la calificación:</label>
                    <input type="number" max={10} min={0} className="input" value={calificacion} onChange={(e) => setCalificacion(e.target.value)} />
                </div>
          <button className="boton">Agregar Materia</button>
        </form>
      </div>
      
    );
}

export default TablaMateriaComponent;
