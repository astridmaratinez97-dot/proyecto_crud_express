const {Router} = require("express");

const enrutador = Router();

enrutador.get("/rutaPersonal", (req,res)=>{
    res.json({ mensaje: "Ruta de prueba, personal"});
});

//se realiza todas las rutas , con (post, put, delete)
module.exports = enrutador;