const express = require('express');
const mongoose = require("mongoose");
const cors = require ('cors')
require("dotenv").config();


//configura la aplicacion Express
const app = express();
app.use(express.json());


//conexion a la base de datos
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexion a MongoDB:"));
db.once("open",()=>{
    console.log("conectado a la base de datos MongoDB");
});

//define el esquema del modelo

const UsuarioSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

//define el modelo
const Usuario = mongoose.model("Usuario", UsuarioSchema);

//Ruta
app.use(cors());
app.get ('/usuarios', async (req, res)=>{
try{
    const usuarios = await Usuario.find();
    res.json(usuarios);
} catch(error){
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({error:"Error interno del servidor"});

}

});

app.post('/agregarusuario', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        usuario.set(req.body);
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/eliminarusuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar el usuario de la base de datos por su ID
        const resultado = await Usuario.deleteOne({ _id: id });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Responder con un mensaje indicando que el usuario ha sido eliminado
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        // Manejar cualquier error que ocurra
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



const port = 3080;
app.listen(port,() =>{
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});






