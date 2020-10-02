const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {
    //Revisión de errores de entrada
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() });
    };
    const { email, password } = req.body;
    try {
        
        //Verificar la existencia del usuario
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ msg: 'El usuario no existe' });
        }
        
        //Verificar password correcto
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({ msg: 'Password incorrecto'});s
        }

        //Crear y firmar el JWT, superada ambas verificaciones
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.TOKEN_WORD, {
            expiresIn: 3600 // 1 hora (son milisegundos)    
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmación exitoso
            res.json({ token });
        });
        
    } catch (error) {
        console.log(error);
    }
}

//Obtiene el usuario autenticado
exports.loggedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}