const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    //Revisión de errores de entrada
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Valida la condición unique del email del usuario
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ msg: 'El correo electrónico del usuario ya existe' });  
        }

        user = new User(req.body);

        //Hasheo del password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        await user.save();

        //Crear y firmar el JWT
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
        res.status(400).send('Hubo un error');
        
    }

    console.log(req.body);
}