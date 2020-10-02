const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Leer el token del header
    const token = req.header('x-auth-token');

    console.log(token);  

    // Revisar si no hay token
    if(!token){
        return res.status(401).json({ msg: 'No hay token, no está autorizado'});
    }

    // Validar el token
    try {
        const verified = jwt.verify(token, process.env.TOKEN_WORD);
        req.user = verified.user;
        next();        
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'});
    }


}