import React, { useState } from 'react';
import './RegistroUsuarioComponent.css';

function RegistroUsuarioComponent() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [edad, setEdad] = useState(0);

    const registrarUsuario = () => {
        const RegistroBackend = {
            name: nombre,
            email: email,
            age: edad,
        };

        const settings = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(RegistroBackend),
        };

        fetch("http://localhost:3080/agregarusuario", settings)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Error en la solicitud");
            })
            .then((data) => {
                console.log("Respuesta", data);
            })
            .catch((error) => {
                console.error("Error", error);
            });
    };

    return (
        <div className="container">
            <div className="form-container">
            <div className='texto1'>
                <h1>AGREGAR USUARIO</h1></div>
                <label>Nombre</label>
                <input 
                    type="text"
                    name="inputNombre"
                    id="inputNombre"
                    placeholder="Introduce tu nombre"
                    value={nombre}
                    onChange={(event) => {
                        setNombre(event.target.value);
                    }}
                />

                <label>Email</label>
                <input 
                    type="text"
                    name="inputEmail"
                    id="inputEmail"
                    placeholder="Introduce tu Correo"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />

                <label>Edad</label>
                <input 
                    type="number"
                    max={30}
                    min={1}
                    name="inputEdad"
                    id="inputEdad"
                    placeholder="Introduce tu edad"
                    value={edad}
                    onChange={(event) => {
                        setEdad(event.target.value);
                    }}
                />
                
                <button onClick={registrarUsuario}>Enviar Informacion</button>
            </div>
        </div>
    );
}

export default RegistroUsuarioComponent;
