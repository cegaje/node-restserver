
const express = require('express');

const _ = require('underscore');

let { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//====================================
// Mostrar todas las categorias
//====================================
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categorias) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            console.log(req.usuario);

            res.json({
                ok: true,
                categorias
            })
        });

});

//====================================
// Mostrar una categoria por ID
//====================================
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.json({
                ok: true,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//====================================
// Crear nueva categoria
//====================================
app.post('/categoria', verificarToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

//====================================
// Actualizar una categoria
//====================================
app.put('/categoria/:id', verificarToken, (req, res) => {
    //Editar solo la descripcion

    let id = req.params.id;

    let data = _.pick(req.body, ['descripcion'] );

    let options = {
        new: true, 
        runValidators: true
    };

    Categoria.findByIdAndUpdate(id, data, options, (err, categoriaDB) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
    
        })
    })
});

//====================================
// Eliminar una categoria
//====================================
app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDelete) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if( categoriaDelete === null){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDelete
        })
    });
});

module.exports = app;