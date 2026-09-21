// 1. IMPORTACIONES DE MÓDULOS
const express = require('express');
const sistemaArchivo = require('fs').promises; // Promesas para usar async/await
const ruta = require('path');
const multer = require('multer');
const jwtoken = require('jsonwebtoken');
require('dotenv').config();

// Importación de middlewares locales
const registroMiddleware = require('./src/middleware/registroMiddleware');
const manejoErroresMiddleware = require('./src/middleware/manejadorErroresMiddleware');
const auntenticacionMiddleware = require('./src/middleware/autenticacionMiddleware');

// Validaciones
const {
  validarNombre,
  validarCorreo,
} = require('./src/validaciones/validacioness');

// 2. INICIALIZACIÓN
const app = express();

// 3. CONFIGURACIÓN
const PUERTO = process.env.MIPUERTO || process.env.PORT || 3003;
const rutaMiArchivo = ruta.join(__dirname, 'datos.json');

// 4. CONFIGURACIÓN DE MULTER
const almacen = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'misImagenes/');
  },
  filename: (req, file, cb) => {
    const extension = ruta.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  },
});

const subir = multer({ storage: almacen });

// 5. MIDDLEWARES DE EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(registroMiddleware);

// 6. RUTAS

// Bienvenida / Ruta Principal
app.get('/', (_, res) => {
  res.status(200).json({ mensaje: 'API REST Full con Express' });
});

// GET: OBTENER todos los aprendices
app.get('/api/aprendices', async (req, res) => {
  try {
    const datos = await sistemaArchivo.readFile(rutaMiArchivo, 'utf-8');
    const listaAprendices = JSON.parse(datos);
    res.status(200).json({ Listado: listaAprendices });
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    res.status(500).json({ Error: 'No se puede leer el archivo' });
  }
});

// GET: OBTENER aprendiz por ID
app.get('/api/aprendices/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const datos = await sistemaArchivo.readFile(rutaMiArchivo, 'utf-8');
    const listaAprendices = JSON.parse(datos);

    const aprendiz = listaAprendices.find((item) => item.id == id);
    if (!aprendiz) {
      return res.status(404).json({ error: 'Aprendiz no encontrado' });
    }

    res.status(200).json(aprendiz);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    res.status(500).json({ Error: 'No se puede leer el archivo' });
  }
});

// POST: CREAR un nuevo aprendiz
app.post('/api/aprendices', subir.single('imagen'), async (req, res) => {
  try {
    const datosAprendiz = req.body;

    // Validar nombre
    if (!validarNombre(datosAprendiz.nombre)) {
      return res.status(400).json({ error: 'El nombre debe tener más de 3 letras' });
    }

    // Validar correo
    if (!validarCorreo(datosAprendiz.correo)) {
      return res.status(400).json({ error: 'El correo no es válido' });
    }

    // Guardar ruta de imagen
    datosAprendiz.imagen = req.file
      ? `/misImagenes/${req.file.filename}`
      : 'sin imagen';

    const datos = await sistemaArchivo.readFile(rutaMiArchivo, 'utf-8');
    const listaAprendices = JSON.parse(datos);

    // Crear ID
    if (listaAprendices.length === 0) {
      datosAprendiz.id = 1;
    } else {
      datosAprendiz.id = listaAprendices[listaAprendices.length - 1].id + 1;
    }

    listaAprendices.push(datosAprendiz);

    await sistemaArchivo.writeFile(
      rutaMiArchivo,
      JSON.stringify(listaAprendices, null, 2)
    );

    res.status(201).json({
      mensaje: 'creado',
      datosAprendiz,
    });
  } catch (error) {
    console.error('Error al guardar:', error);
    res.status(500).json({ error: 'Error interno al intentar guardar el aprendiz' });
  }
});

// PUT: ACTUALIZAR aprendiz
app.put('/api/aprendices/:id', subir.single('imagen'), async (req, res) => {
  try {
    const id = req.params.id;
    const datos = await sistemaArchivo.readFile(rutaMiArchivo, 'utf-8');
    const listaAprendices = JSON.parse(datos);

    const aprendiz = listaAprendices.find((item) => item.id == id);
    if (!aprendiz) {
      return res.status(404).json({ error: 'Aprendiz no encontrado' });
    }

    // Validaciones opcionales
    if (req.body.nombre && !validarNombre(req.body.nombre)) {
      return res.status(400).json({ error: 'El nombre debe tener más de 3 letras' });
    }

    if (req.body.correo && !validarCorreo(req.body.correo)) {
      return res.status(400).json({ error: 'El correo no es válido' });
    }

    // Actualizar datos
    Object.assign(aprendiz, req.body);

    if (req.file) {
      aprendiz.imagen = `/misImagenes/${req.file.filename}`;
    }

    await sistemaArchivo.writeFile(
      rutaMiArchivo,
      JSON.stringify(listaAprendices, null, 2)
    );

    res.status(200).json({
      mensaje: 'Actualizado',
      aprendiz,
    });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ error: 'Error interno al actualizar el aprendiz' });
  }
});

// DELETE: ELIMINAR aprendiz
app.delete('/api/aprendices/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const datos = await sistemaArchivo.readFile(rutaMiArchivo, 'utf-8');
    const listaAprendices = JSON.parse(datos);

    const indice = listaAprendices.findIndex((item) => item.id == id);
    if (indice === -1) {
      return res.status(404).json({ error: 'Aprendiz no encontrado' });
    }

    listaAprendices.splice(indice, 1);

    await sistemaArchivo.writeFile(
      rutaMiArchivo,
      JSON.stringify(listaAprendices, null, 2)
    );

    res.status(200).json({ mensaje: 'Eliminado' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ error: 'Error interno al eliminar el aprendiz' });
  }
});

// Ruta de error provocado
app.get('/api/error', (_, __, next) => {
  next(new Error('Esto es un error provocado'));
});

// Ruta protegida con token
app.get('/api/rutaprotegida', auntenticacionMiddleware, (req, res) => {
  res.json({ mensaje: 'Ruta protegida, acceso concedido', usuario: req.usuario });
});

// RUTA DE INICIO DE SESIÓN PARA GENERAR UN TOKEN
app.post('/api/login', (req, res) => {
  const { usuario, clave } = req.body;
  const bdUsuario = { usuario: 'Yojan', clave: '1995' };

  if (usuario !== bdUsuario.usuario || clave !== bdUsuario.clave) {
    return res.status(401).json({ mensaje: 'Usuario o clave incorrectos' });
  }

  const token = jwtoken.sign(
    { usuario },
    process.env.JWT_SECRETO || 'secreto123',
    { expiresIn: '1h' }
  );

  res.json({
    mensaje: 'Login exitoso',
    token: token,
  });
});


// Middleware de manejo de errores
app.use(manejoErroresMiddleware);

// 7. ARRANQUE DEL SERVIDOR
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
});