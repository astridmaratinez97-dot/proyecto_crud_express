const express = require('express');

// Librerías fs, path
const sistemaArchivos = require("fs");
const ruta = require("path");


const MIPUERTO = 3333;
const rutaMiArchivo = ruta.join(__dirname, "datos.json");

//importar Multer
const multer = require ("multer")

// Almacenamiento
const almacen = multer.diskStorage({
    destination: (req, File, cb) => {
        cb(null, "misImagenes/");
    },

    filename: (req, File, cb) => {
        const extension = ruta.extname(File.originalname);

        cb(null, `${Date.now()} ${extension}`);
    }
});


const subir = multer ({ storage: almacen})


// Middleware body-parser
const app = express ()
app.use(express.json());
app.use (express.urlencoded({extended: true}))


// Ruta principal
app.get("/", (_, res) => {
    res.send('API REST Full con Express');
});


// Obtener lista de aprendices desde el archivo
app.get("/api/aprendices", (req, res) => {

    sistemaArchivos.readFile(rutaMiArchivo, "UTF-8", (error, datos) => {

        if (error) {
            res.status(500).json({
                Error: "No se puede leer el archivo"
            });
        }

        const ListaAprendices = JSON.parse(datos);

        res.status(200).json({
            Listado: ListaAprendices
        });

    });

});


// Obtener aprendices
app.get("/api/aprendices", (_, res) => {
    res.status(200).json({
        mensaje: 'lista aprendices'
    });
});


// Crear aprendiz
app.post("/api/aprendices", subir.single ('imagen'),(req, res) => {

    const datosAprendiz = req.body;
    datosAprendiz.imagen = req.file? `/misImagenes/ ${req.file.filename}` : "sin imagen"

    sistemaArchivos.readFile(rutaMiArchivo, "UTF-8", (error, datos) => {

        if (error) {
            res.status(500).json({
                Error: "No se puede leer el archivo"
            });
        }

        const ListaAprendices = JSON.parse(datos);

        ListaAprendices.push(datosAprendiz);

        sistemaArchivos.writeFile(
            rutaMiArchivo,
            JSON.stringify(ListaAprendices, null, 2),
            (error) => {

                if (error) {
                    res.status(500).json({
                        Error: "No se puede escribir en file"
                    });
                }

                res.status(200).json({
                    Mensaje: "Creado",
                    Datos: datosAprendiz
                });

            }
        );

    });

});



// Actualizar aprendiz
app.put("/api/aprendices/:id_aprendices", (_, res) => {
    res.status(200).json({
        mesaje: 'Actializar aprendiz'
    });
});


// Eliminar aprendiz
app.delete("/api/aprendices/:id_aprendices", (_, res) => {
    res.status(200).json({
        mensaje: 'Eliminada'
    });
});


// Iniciar servidor
app.listen(MIPUERTO, () => {
    console.log(`Servidor en funcionamiento en el puerto: ${MIPUERTO}`);
});
