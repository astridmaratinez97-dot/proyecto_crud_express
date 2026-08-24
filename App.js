import express from 'express';
import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  console.log('No se pudo cargar el archivo .env:', result.error.message);
} else {
  console.log('.env cargado correctamente:', result.parsed);
}

const app = express();
const PUERTO = process.env.MIPUERTO || 3003;

app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});

app.listen(PUERTO, () => {
  console.log(`API Rest Full con express - Puerto ${PUERTO}`);
});