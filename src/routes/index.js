//consolida o agrupa todos los enrutadores
const { Router } = require("express");
const enrutadorGeneral = Router();
const enrutadorPrueba = require ("./pruebaRouter");
//importar enroutadorAuth
const enroutadorAuth = require("./autenticarRouter")


enrutadorGeneral.use("/rutaprueba", enrutadorPrueba);
enrutadorGeneral.use("/autenticar", enroutadorAuth)
module.exports = enrutadorGeneral;