const iniciarSesion = async (req, res) =>{
   
    //simular bd de un usuario registrado
    const userBd = {"usuario": "Daniel", "clave": "123"}
    try {
        const {usuario, clave} = req.body
        //comparar con userBD
        if(userBd.usuario !== usuario || userBd.clave !== clave){
            res.json({mensaje: "usuario o clave incorrecta"})
        }
        res.json({mensaje: "Usuario Bienvenido"})
    } catch (error) {
        res.json({error: error})
    }
}


const registrarse = async (req, res)=>{
    try {
        const datos = req.body
        res.json({datosregistro: datos})
    } catch(error) {
        res.json({error: error})
    }
}

module.exports = {iniciarSesion, registrarse}