import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa Link y useLocation desde react-router-dom

import './NavBarA.css'; // Importamos los estilos CSS para el componente

function NavbarA({ onLogout }) {
  const location = useLocation();

  // Verificar la ruta actual y ocultar el NavBar en la página de inicio de sesión
  const showNavBar = location.pathname !== '/' && location.pathname !== '/Admin' && location.pathname !== '/registro';
  
  const handleLogout = () => {
    // Llama a la función de cierre de sesión proporcionada por el componente principal
    onLogout();
  };

  // Mostrar el NavBar solo si showNavBar es true
  return showNavBar ? (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="school-name">UTM</span>
      </div>
      <div>
        {/* Agrega botones para navegar a diferentes rutas */}
     
        
      </div>
      <div className="navbar-right">
        {/* Hacer que la imagen del logo sea un enlace a la página de inicio de sesión */}
        <Link to="/Admin">
          <img src="./Escuela.svg" alt="Logo de la plataforma" className="logo" />
        </Link>
      </div>
      <div>
        <Link to="/" onClick={handleLogout}>Cerrar sesión</Link>
      </div>
    </nav>
  ) : null;
}

export default NavbarA;