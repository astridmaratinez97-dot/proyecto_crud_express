const {Router} = require("express");
const enrutadorAuth = Router();
//importacion 
const {iniciarSesion, registrarse} = require ("../controllers/autenticarController")
//const registrarse = require ("../controllers/auntenticarController")



// ruta vde registro en el sistema
enrutadorAuth.post("/registrar", registrarse)

 //ruta de inicio de sesion
enrutadorAuth.post("/login", iniciarSesion)

//se realiza todas las rutas, con (POST, PUT, DELETE)
module.exports = enrutadorAuth;