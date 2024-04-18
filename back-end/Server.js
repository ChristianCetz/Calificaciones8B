const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3080;

app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
  });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendita',

});

connection.connect((err)=>{
    if(err){
        console.error('Error de conexion', err);
        return;
    }
    console.log('conexion realizada!');

    connection.query("SELECT * FROM productos", (err, rows)=>{
        if(err){
            console.error('Errot de conexion', err);
            return;
        }
    });
})
// Permitir solicitudes CORS desde cualquier origen
app.use(cors());
app.get("/obtenerproductos", (request, response)=> {
    connection.query("SELECT * FROM productos", (err, rows)=>{
        if (err){
            console.error('Error de conexion', err);
            response.status(500).send('Error de conexion a la base de datos');
            return;
        }
        response.json(rows);
    });
});

app.use(express.json());

app.post("/agregarproducto", (request, response) => {
    const { nombre, precio, stock, id_categoria } = request.body;
    const productonuevo = { nombre, precio, stock, id_categoria };

    connection.query("INSERT INTO productos SET ?", productonuevo, (err, result) => {
        if (err) {
            console.error('Error de conexión ', err);
            response.status(500).send('Error de conexión a la base de datos');
            return;
        }
        response.status(201).send('Producto guardado');
    });
});




// Manejar solicitud POST para actualizar un producto existente
app.put("/actualizarproducto/:id", (request, response) => {
    const productoID = request.params.id;
    const productoActualizado = request.body;

    if (!productoActualizado.idproductos || !productoActualizado.nombre || !productoActualizado.precio || !productoActualizado.stock || !productoActualizado.id_categoria) {
        response.status(400).send('Faltan campos obligatorios');
        return;
    }

    connection.query("UPDATE productos SET ? WHERE idproductos = ?", [productoActualizado, productoID], (err, result) => {
        if (err) {
            console.error('Error de conexión ', err);
            response.status(500).send('Error de conexión a la base de datos');
            return;
        }
        if (result.affectedRows === 0) {
            response.status(404).send('Producto no encontrado');
        } else {
            response.status(200).send('Producto actualizado correctamente');
        }
    });
});

//Metodo para borrar productos

app.delete("/eliminarproducto/:id",(request, response) => {
    const id = request.params.id;
    
    connection.query(
        "DELETE FROM productos WHERE idproductos = ?"
    ,[id],
    (error, results ) => {
        if(error){
        console.error('Error al eliminar el producto: ' + error.stack);
        response.status(500)('Error interno del servidor');
        return;
    }
    if(results.affectedRows === 0){
     response.status(404).send("Producto no encontrado pipipi");
    } else {
        response.status(200).send("Producto eliminado correctamente");
    }
    });
});





    