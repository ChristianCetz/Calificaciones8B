import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TablaAlumnosComponent.css';

function TablaAlumnosComponent({ userId }) {
    const [calificaciones, setCalificaciones] = useState([]);
    const [nombreUsuario, setNombreUsuario] = useState('');

    useEffect(() => {
        const cargarCalificacionesUsuario = async () => {
            try {
                // Obtener el nombre del usuario
                const usuarioResponse = await axios.get(`http://localhost:3080/obtenerusuarios/${userId}`);
                const usuarioData = usuarioResponse.data;
                setNombreUsuario(usuarioData.nombre);

                // Obtener las calificaciones del usuario
                const calificacionesResponse = await axios.get(`http://localhost:3080/obtenercalificaciones?usuarioId=${userId}`);
                const calificacionesData = calificacionesResponse.data;
                const calificacionesConNombres = await Promise.all(calificacionesData.map(async (calificacion) => {
                    const materiaResponse = await axios.get(`http://localhost:3080/obtenermaterias/${calificacion.materiaId}`);
                    const materiaData = materiaResponse.data;
                    return { ...calificacion, materiaNombre: materiaData.nombre };
                }));
                setCalificaciones(calificacionesConNombres);
            } catch (error) {
                console.error('Error al cargar las calificaciones del usuario:', error);
            }
        };

        cargarCalificacionesUsuario();
    }, [userId]);

    return (
        
        <div className="tabla-container">
            <h2 className='titulo5' >¡Bienvenido, {nombreUsuario}!</h2>
            <h3 className='titulo5'>Tus calificaciones</h3>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Materia</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    {calificaciones.map((calificacion, index) => (
                        <tr key={index}>
                            <td>{calificacion.materiaNombre}</td>
                            <td>{calificacion.calificacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablaAlumnosComponent;
