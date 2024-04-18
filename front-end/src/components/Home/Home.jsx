// En Home.jsx

import React from 'react';
import { Link} from 'react-router-dom';

import './Home.css'; // Importamos los estilos CSS para el componente

function Home() {
  return (
    <div className="Custom-container-8">
      <div className="Custom-welcome-box-8">
        <h1>Bienvenido a la plataforma</h1>
        <p>Consulta tus calificaciones aquí</p>
      </div>
      <div className="Custom-button-container-8">
        <Link to="/Login"className="Custom-button-8">Alumnos</Link>
        <button className="Custom-button-8">¿Maestros?</button>
      </div>
    </div>
  );
}

export default Home;
