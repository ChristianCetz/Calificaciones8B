import React, { useState } from "react";
import "./Admin.css";

function Admin() {
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const saludarUsuario = (message) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.lang = "es-ES";
    synth.speak(utterThis);
};

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correo = event.target.elements.correo.value;
    const contraseña = event.target.elements.contraseña.value;

    setIsLoading(true);

    try {
      if (correo === "Cetzal@gmail.com" && contraseña === "123456789") {
        
        setMensaje("Admin Bienvenido");
        saludarUsuario("Admin Bienvenido")
        window.location.href = "/Calificaciones";
      } else {
        setMensaje("Datos Incorrectos");
        saludarUsuario("Datos Incorrectos")
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("Error interno del servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="containerAdmin">
      <div className="card">
        <div className="card-bodyAdmin">
          <h2 className="taman">Iniciar Sesión Admin</h2>
          <form onSubmit={handleSubmit}>

            <div className="flex-containerAdmin">
            <img src="./avatar-svgrepo-com.svg" alt="" className="avatarAdmin" />
            <div className="input-containerAdmin">
                <label htmlFor="correo"></label>
                <input className="custom-inputAdmin" type="text" id="correo" name="correo" placeholder="Correo" />
            </div>
            </div>

            <br />
            <div className="flex-containerAdmin">
            <img src="./padlock-svgrepo-com.svg" alt="" className="avatarAdmin" />
            <div className="input-containerAdmin">
              <label htmlFor="contraseña"></label>
              <input className="custom-inputAdmin" type="password" id="contraseña" name="contraseña" placeholder="Contraseña" />
            </div>
            </div>

            <br />
            <div className="button-containerAdmin">
            <button  className="custom-buttoAdmin" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Entrar"}
            </button>
            </div>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default Admin;
