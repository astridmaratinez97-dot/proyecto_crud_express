const manejoErroresMiddleware = (error, req, res, next) => {
    const codigoError = error.statusCode || 500
    const mensajeError = error.message || "Error"
    console.error(`[Error] ${new Date().toISOString()} - ${req.method} - ${req.url} - ${req.ip}`)

    // validar si hay informacion
    if (error.stack) {
        console.error(error.stack)
    }

    res.status(codigoError).json({
        ERROR: "Error",
        codigoError: mensajeError,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    })
}

module.exports = manejoErroresMiddleware