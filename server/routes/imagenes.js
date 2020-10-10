const express = require('express');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

const fs = require('fs');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

    if( fs.existsSync( pathImagen) ){
        res.sendFile( pathImagen )
    }else{
        res.sendFile(noImagePath);
    }
});

module.exports = app;
