const express = require('express');
const mongoose = require("mongoose");
const cors = require ('cors')
const bcrypt = require('bcrypt');
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

const CalificacionesSchema = new mongoose.Schema({
    materiaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    calificacion: {
        type: Number,
        required: true
    }
});

const MateriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    edad: Number,
    genero: String,
    rol: {
        type: String,
        enum: ['alumno', 'maestro'], // Define los roles permitidos
        required: true
    },
    contrasena: {
        type: String,
        required: true
    }
});

UsuarioSchema.pre('save', async function(next) {
    const usuario = this;
    if (!usuario.isModified('contrasena')) return next();

    try {
        const hashedPassword = await bcrypt.hash(usuario.contrasena, 10); // Genera el hash de la contraseña
        usuario.contrasena = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

UsuarioSchema.pre('remove', async function(next) {
    try {
      await Calificaciones.deleteMany({ usuarioId: this._id });
      next();
    } catch (error) {
      next(error);
    }
  });
  

const Calificaciones = mongoose.model('Calificaciones', CalificacionesSchema);
const Materia = mongoose.model('Materia', MateriaSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);




//Ruta
app.use(cors());
// Ruta para obtener todas las calificaciones
app.get('/obtenercalificaciones', async (req, res) => {
    const { usuarioId } = req.query;
    try {
        const calificaciones = await Calificaciones.find({ usuarioId: usuarioId });
        res.json(calificaciones);
    } catch (error) {
        console.error('Error al obtener calificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.get('/usuarios-con-calificaciones', async (req, res) => {
    try {
      // Obtener todas las calificaciones
      const calificaciones = await Calificaciones.find().populate('usuarioId').populate('materiaId');
  
      // Organizar los datos para mostrar usuarios con sus calificaciones
      const usuariosConCalificaciones = calificaciones.reduce((result, calificacion) => {
        const { usuarioId, materiaId, calificacion: calificacionValue } = calificacion;
        const { _id, nombre, correo, edad, genero, rol } = usuarioId;
  
        if (!result[nombre]) {
          result[nombre] = {
            _id,
            nombre,
            correo,
            edad,
            genero,
            rol,
            calificaciones: [],
          };
        }
  
        result[nombre].calificaciones.push({
          materia: materiaId.nombre,
          calificacion: calificacionValue,
        });
  
        return result;
      }, {});
  
      // Convertir el objeto en un arreglo de usuarios
      const usuariosArray = Object.values(usuariosConCalificaciones);
  
      res.json(usuariosArray);
    } catch (error) {
      console.error('Error al obtener usuarios con calificaciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

// Ruta para obtener los usuarios con calificaciones menores a 7
app.get('/usuarios-reprobados', async (req, res) => {
    try {
        // Obtener todas las calificaciones
        const calificaciones = await Calificaciones.find().populate('usuarioId').populate('materiaId');

        // Filtrar usuarios con al menos una calificación menor a 7
        const usuariosReprobados = calificaciones.reduce((reprobados, calificacion) => {
            if (calificacion.calificacion <= 6) {
                const usuario = calificacion.usuarioId;
                const materia = calificacion.materiaId;
                if (!reprobados.some(rep => rep._id.equals(usuario._id))) {
                    reprobados.push({ _id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, edad: usuario.edad, reprobadas: [{ materia: materia.nombre, calificacion: calificacion.calificacion }] });
                } else {
                    const index = reprobados.findIndex(rep => rep._id.equals(usuario._id));
                    reprobados[index].reprobadas.push({ materia: materia.nombre, calificacion: calificacion.calificacion });
                }
            }
            return reprobados;
        }, []);

        res.json(usuariosReprobados);
    } catch (error) {
        console.error('Error al obtener usuarios reprobados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta para agregar una nueva calificación
app.post('/agregarcalificaciones', async (req, res) => {
    try {
        const nuevaCalificacion = new Calificaciones(req.body);
        await nuevaCalificacion.save();
        res.status(201).json(nuevaCalificacion);
    } catch (error) {
        console.error('Error al agregar calificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/actualizarcalificaciones/:id', async (req, res) => {
    const { id } = req.params;
    const { calificacion } = req.body;
    try {
      const calificacionActualizada = await Calificaciones.findByIdAndUpdate(
        id,
        { calificacion: calificacion },
        { new: true }
      );
      res.json(calificacionActualizada);
    } catch (error) {
      console.error('Error al actualizar calificación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  
  
// Ruta para eliminar una calificación
app.delete('/eliminarcalificaciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await Calificacion.deleteOne({ _id: id });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: 'Calificación no encontrada' });
        }
        res.json({ message: 'Calificación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar calificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/eliminarusuarioycalificaciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si el usuario existe
        const usuarioExistente = await Usuario.findById(id);
        if (!usuarioExistente) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Eliminar las calificaciones asociadas al usuario
        const deleteCalificacionesResult = await Calificaciones.deleteMany({ usuarioId: id });
        console.log('Resultado de eliminar calificaciones:', deleteCalificacionesResult);

        // Eliminar al usuario
        const deleteUsuarioResult = await Usuario.deleteOne({ _id: id });
        console.log('Resultado de eliminar usuario:', deleteUsuarioResult);

        if (deleteUsuarioResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario y calificaciones eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario y calificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

  



// Ruta para obtener todas las materias
app.get('/obtenermaterias', async (req, res) => {
    try {
        const materias = await Materia.find();
        res.json(materias);
    } catch (error) {
        console.error('Error al obtener materias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener una materia por su ID
app.get('/obtenermaterias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const materia = await Materia.findById(id);
        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        res.json(materia);
    } catch (error) {
        console.error('Error al obtener materia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



// Ruta para agregar una nueva materia
app.post('/agregarmateria', async (req, res) => {
    try {
        const nuevaMateria = new Materia(req.body);
        await nuevaMateria.save();
        res.status(201).json(nuevaMateria);
    } catch (error) {
        console.error('Error al agregar materia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar una materia
app.put('/actualizarmaterias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const materia = await Materia.findById(id);
        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        materia.set(req.body);
        await materia.save();
        res.json(materia);
    } catch (error) {
        console.error('Error al actualizar materia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para eliminar una materia
app.delete('/eliminarmaterias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await Materia.deleteOne({ _id: id });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        res.json({ message: 'Materia eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar materia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



// Ruta para obtener todos los usuarios
app.get('/obtenerusuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
app.get('/obtenerusuarios/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar al usuario por su correo electrónico
        const usuario = await Usuario.findOne({ correo });

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Verificar si la contraseña es correcta
        const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contraseñaValida) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Usuario autenticado correctamente
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta para agregar un nuevo usuario
app.post('/agregarusuarios', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar un usuario
app.put('/actualizarusuarios/:id', async (req, res) => {
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

// Ruta para eliminar un usuario
app.delete('/eliminarusuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await Usuario.deleteOne({ _id: id });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Fin Ruta


const port = 3080;
app.listen(port,() =>{
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});






