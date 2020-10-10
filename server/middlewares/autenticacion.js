const jwt = require('jsonwebtoken');

//==========================
//Verificar Token
//==========================
let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        
        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        
        req.usuario = decoded.Usuario;
        next();
    });

};

//==========================
//Verifica Admin Role
//==========================

let verificarAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if( usuario.role != 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();

};

//==========================
//Verifica token para imagen
//==========================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        
        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        
        req.usuario = decoded.Usuario;
        next();
    });
}

module.exports = {
    verificarToken,
    verificarAdmin_Role,
    verificaTokenImg
}