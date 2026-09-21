require("dotenv").config();
const express = require("express")

const app = express()

//importar los Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//usamos el enroutador general
const enroutadorGeneral = require("./routes")
app.use("/api", enroutadorGeneral)

//endpoint de la ruta raiz, de bienvenida a la API
app.get("/", (req, res) =>{
    res.send("API Rest 3407182 en funcionamiento")
});

module.exports = app;