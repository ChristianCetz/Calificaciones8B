import React, { useState } from 'react';
import axios from 'axios';
import "./LoginComponent.css";

function LoginComponent({ onLoginSuccess }) {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    
    const saludarUsuario = (message) => {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.lang = "es-ES";
        synth.speak(utterThis);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si los campos están completos
        if (correo === '' || contrasena === '') {
            const message = 'Faltan campos por completar.';
            saludarUsuario(message);
            
            
        }

        try {
            // Realizar solicitud para iniciar sesión
            const response = await axios.post('http://localhost:3080/login', {
                correo: correo,
                contrasena: contrasena,
            });
            if (response.data.success) {
                    
                saludarUsuario('bienvenido')
                // Notificar a la aplicación principal que el inicio de sesión fue exitoso
                onLoginSuccess(response.data.usuario._id);
            } else {
                // Verificar si el error es debido a contraseña incorrecta
                if (response.data.message === 'Contraseña incorrecta') {
                    saludarUsuario('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
                    const message = 'Contraseña incorrecta. Por favor, inténtalo de nuevo.';
                    
                } else {
                    alert('Error: ' + response.data.message);
                    
                }
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        
            // Mostrar el mensaje de error en la alerta
            alert('Error al iniciar sesión: ' + (error.response ? error.response.data.message : error.message));
            saludarUsuario('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <div className="main-containe">
                <div className="centered-containe">
                    <h1 className="taman">Login</h1>
                    <div className="flex-containe">
                        <div>
                            <img src="/avatar-svgrepo-com.svg" alt="" className="avata" />
                        </div>
                        <div className="input-containe">
                            <input type="text" placeholder="Email" className="custom-inpu" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-containe">
                        <div>
                            <img src="/padlock-svgrepo-com.svg" alt="" className="avata" />
                        </div>
                        <div className="input-containe">
                            <input type="password" placeholder="Contraseña" className="custom-inpu" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        </div>
                    </div>
                    <div className="button-containe">
                        <button className="custom-butto1" onClick={handleSubmit}>Login</button>
                    </div>
                </div>
            </div>
            <div>
            <h1 className="registro1">¿No tienes cuenta?</h1>
            </div >
            <div className= "custom-container-login"> <a className="custom-butto1" href="/Registro">Regístrate</a></div>
        </div>
    );
}

export default LoginComponent;
