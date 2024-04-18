import React, { useState } from 'react';
import axios from 'axios';
import "./RegistroComponent.css"

function RegistroComponent() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [edad, setEdad] = useState('');
    const [genero, setGenero] = useState('');
    
    const saludarUsuario = (message) => {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.lang = "es-ES";
        synth.speak(utterThis);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (nombre === '' || correo === '' || contrasena === '' || edad === '' || genero === '') {
            alert('Faltan campos por completar.');
            return;
        }

        let mensajeNombre = '';
        let mensajeContrasena = '';

        if (nombre.length < 5) {
            mensajeNombre = 'Tu nombre debe contener al menos 5 caracteres.';
        }

        if (contrasena.length < 5) {
            mensajeContrasena = 'Tu contraseña debe contener al menos 5 caracteres.';
        }

        if (mensajeNombre && mensajeContrasena) {
            // Ambos nombres y contraseñas no cumplen la función
            const mensaje = `${mensajeNombre} Además, ${mensajeContrasena}`;
            saludarUsuario(mensaje);
      
            return;
        }

        if (mensajeNombre) {
            // El nombre no cumple la función
            saludarUsuario(mensajeNombre);
            return;
        }

        if (mensajeContrasena) {
            // La contraseña no cumple la función
            saludarUsuario(mensajeContrasena);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3080/agregarusuarios', {
                nombre: nombre,
                correo: correo,
                contrasena: contrasena,
                edad: edad,
                genero: genero,
                rol: 'alumno'
            });
            console.log('Usuario registrado:', response.data);
            alert('Usuario registrado exitosamente.');
             // Limpiar los campos después de un registro exitoso
             setNombre('');
             setCorreo('');
             setContrasena('');
             setEdad('');
             setGenero('')
            // Aquí podrías redirigir al usuario a otra página o mostrar un mensaje de éxito, etc.
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    return (
        <div>
            <div className="main-container">
                <div className="centered-container">
                    <h1 className="tamano">Regístrate</h1>
                    <div className="flex-container">
                        <div>
                            <img src="/avatar-svgrepo-com.svg" alt="" className="avatar" />
                        </div>
                        <div className="input-container">
                            <input type="text" placeholder="Introduce tu nombre" className="custom-input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-container">
                        <div>
                            <img src="/arroba.svg" alt="" className="avatar" />
                        </div>
                        <div className="input-container">
                            <input type="email" placeholder="Introduce tu Correo" className="custom-input" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-container">
                        <div>
                            <img src="/padlock-svgrepo-com.svg" alt="" className="avatar" />
                        </div>
                        <div className="input-container">
                            <input type="password" placeholder="Introduce tu contraseña" className="custom-input" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-container">
                        <div>
                            <img src="/Number.svg" alt="" className="avatar" />
                        </div>
                        <div className="input-container">
                            <input type="number" max={99} min={1} placeholder="Edad" className="custom-input" value={edad} onChange={(e) => setEdad(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-container">
                        <div>
                            <img src="/genero.svg" alt="" className="avatar" />
                        </div>
                        <div className="input-container">
                            <select className="custom-input" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
                                <option value="femenino">Femenino</option>
                                <option value="masculino">Masculino</option>
                                <option value="prefiero-no-responder">Prefiero no responder</option>
                            </select>
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="custom-button" onClick={handleSubmit}>Registrar</button>
                    </div>
                    
                </div>
            </div>

            <div>
            <h1 className="login1">¿Ya tienes cuenta?</h1>
            </div >
                    <div className= "custom-container-login"> <a className="custom-butto2" href="/">Iniciar sesion</a></div>
        </div>
    );
}

export default RegistroComponent;
