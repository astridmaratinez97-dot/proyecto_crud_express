const app = require("./app");

// 1. Importa enrutador de prueba
const pruebaRouter = require("./routes/pruebaRouter");

const MIPUERTO = process.env.MIPUERTO || 3000;

// 2. Monta el router en la aplicación
app.use("/api", pruebaRouter);

app.listen(MIPUERTO, () => {
    console.log(`SERVIDOR FUNCIONANDO http://localhost:${MIPUERTO}`);
});