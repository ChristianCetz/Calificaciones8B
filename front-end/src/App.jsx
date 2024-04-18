import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent/LoginComponent';
import TablaAlumnosComponent from './components/TablaAlumnosComponent/TablaAlumnosComponent';
import TablaMateriaComponent from './components/TablaMateriaComponent/TablaMateriaComponent';
import ReprobadosComponent from './components/ReprobadosComponent/ReprobadosComponent';
import RegistroComponent from './components/RegistroComponent/RegistroComponent';
import Admin from './components/Admin/Admin';
import TabladealumnosComponent from './components/TabladealumnosComponent/TabladealumnosComponent';
import AlumnosComponent from './components/AlumnosComponent/AlumnosComponent';
import AgregarMateriaComponent from './components/AgregarMateriaComponent/AgregarMateriaComponent';
import NavbarA from './components/NavbarA/NavBarA';
import NavBarComponent from './components/NavBarComponent/NavBarComponent'
import ActualizarMateria from './components/actualizarmateria/actualizarmateria';

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Verificar si hay una sesión iniciada al cargar la aplicación
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }
  }, []);

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = (userId) => {
    setUserId(userId); // Almacena el userId en el estado
    localStorage.setItem('userId', userId); // Guarda userId en el localStorage
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <Router>
     <NavBarComponent onLogout={handleLogout} />
     <div id="main-content">
      <Routes>
        <Route
          path="/"
          element={
            userId ? (
              <Navigate to="/tabla-alumnos" />
            ) : (
              <LoginComponent onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/tabla-alumnos"
          element={
            <>
              <NavbarA onLogout={handleLogout} />
              <TablaAlumnosComponent userId={userId} />
            </>
          }
        />
        <Route path="/Reprobados" element={<ReprobadosComponent />} />
        <Route path="/registro" element={<RegistroComponent />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Calificaciones" element={<TabladealumnosComponent />} />
        <Route path="/agregarcalificaciones" element={<TablaMateriaComponent />} />
        <Route path="/alumnos" element={<AlumnosComponent />} />
        <Route path="/agregarmateria" element={<AgregarMateriaComponent />} />
        <Route path="/actualizarmateri" element={<ActualizarMateria/>}/>
        
      </Routes>
      </div>
    </Router>
  );
}

export default App;
