const manejadorErroresMiddlewares = (error, req, res, next) => {
    const codigoError = error.statusCode || 500;
    const mensajeError = error.message || "Error inesperado";
    console.error(`[Error] ${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);

    // VALIDAR SI HAY MAS INFORMACION
    if (error.stack) {
        console.error(error.stack);
    }
    
    res.json({ 
        error: codigoError, 
        message: mensajeError, 
        // configurar .env , para mostrar errores solo en modo development
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
    
    next();
};

module.exports = manejadorErroresMiddlewares;