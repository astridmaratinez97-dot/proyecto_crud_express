// Expresiones regulares
const regexID = /^\d+$/;
const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{4,}$/;
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validarAprendiz = (req, res, next) => {
  const { id, nombre, correo } = req.body;
  const errores = [];

  // Validaciones
  if (!id || !regexID.test(String(id))) {
    errores.push("El ID debe ser un número entero positivo.");
  }

  if (!nombre || !regexNombre.test(String(nombre).trim())) {
    errores.push("El nombre debe tener más de 3 letras (mínimo 4) y solo contener letras.");
  }

  if (!correo || !regexCorreo.test(String(correo).trim())) {
    errores.push("El correo electrónico no tiene un formato válido.");
  }

  // Si hay errores, detiene el flujo y responde 400
  if (errores.length > 0) {
    return res.status(400).json({
      exito: false,
      mensaje: "Error de validación en los datos ingresados",
      errores: errores
    });
  }

  // Si todo está correcto, pasa a la ruta en app.js
  next();
};

module.exports = { validarAprendiz };