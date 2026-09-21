// name > 3 letras
        //correo expresq
        //id
function validarNombre(nombre) {
    if (!nombre || typeof nombre !== "string") {
        return false;
    }

    return nombre.trim().length > 3;
}

function validarCorreo(correo) {
    if (!correo || typeof correo !== "string") {
        return false;
    }

    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresionRegular.test(correo);
}
function validarId(id) {
    if (!id) {
        return false;
    }

    return !isNaN(id) && Number(id) > 0;
}

module.exports = {
    validarNombre,
    validarCorreo,
    validarId
};