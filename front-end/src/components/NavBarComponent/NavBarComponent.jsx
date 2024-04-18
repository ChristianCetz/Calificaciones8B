import { Link, useLocation } from 'react-router-dom'; // Importa Link y useLocation desde react-router-dom

import './NavBarComponent.css'; // Importamos los estilos CSS para el componente

function NavBarComponent({ onLogout }) {
  const location = useLocation();

  // Verificar la ruta actual y ocultar el NavBar en la página de inicio de sesión
  const showNavBar = location.pathname !== '/' && location.pathname !== '/Admin' && location.pathname !== '/Registro'  && location.pathname !== '/registro'  && location.pathname !== '/admin';

  const handleLogout = () => {
    // Llama a la función de cierre de sesión proporcionada por el componente principal
    onLogout();
  };

  // Mostrar el NavBar solo si showNavBar es true
  return showNavBar ? (
    <nav className="navbar">
      <div className="navbar-left">
      <Link to="/">
        <span className="school-name">UTM</span>
        </Link>
      </div>
      <div>
        {/* Agrega botones para navegar a diferentes rutas */}
        <Link to="/alumnos">
          <button>Alumnos</button>
        </Link>
        <Link to="/agregarcalificaciones">
          <button>Agregar Calificaciones</button>
        </Link>
        <Link to="/agregarmateria">
          <button>Agregar Materia</button>
        </Link>
        <Link to="/actualizarmateri">
          <button>Actualizar Materias</button>
        </Link>
        <Link to="/Reprobados">
          <button>Reprobados</button>
        </Link>
        <Link to="/Calificaciones">
          <button>Calificaciones</button>
        </Link>
        
        
        
      </div>
      <div className="navbar-right">
        {/* Hacer que la imagen del logo sea un enlace a la página de inicio de sesión */}
        <Link to="/Admin">
          <img src="./Escuela.svg" alt="Logo de la plataforma" className="logo" />
        </Link>
      </div>
      
    </nav>
  ) : null;
}

export default NavBarComponent;