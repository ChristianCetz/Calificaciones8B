import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReprobadosComponent.css';

function ReprobadosComponent() {
    const [reprobados, setReprobados] = useState([]);

    useEffect(() => {
        const obtenerReprobados = async () => {
            try {
                const response = await axios.get('http://localhost:3080/usuarios-reprobados');
                setReprobados(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios reprobados:', error);
            }
        };

        obtenerReprobados();
    }, []);

    return (
        <div className="reprobados-container">
            <h2 className="titulo3">Lista de Reprobados</h2>
            <table className="lista-reprobados">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Materia</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    {reprobados.map(usuario => (
                        usuario.reprobadas.map((reprobada, index) => (
                            <tr key={`${usuario._id}-${index}`}>
                                {index === 0 && <td rowSpan={usuario.reprobadas.length}>{usuario.nombre}</td>}
                                <td>{reprobada.materia}</td>
                                <td>{reprobada.calificacion}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReprobadosComponent;
