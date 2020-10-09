const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//====================================
// Mostrar todos los productos
//====================================
app.get('/productos', verificarToken, (req, res) => {
    // trae todos los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });
});

//====================================
// Obtener un producto por ID
//====================================
app.get('/productos/:id', verificarToken, (req, res) => {
    //populate: usuario categoria
    //paginado

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            return res.json({
                ok: true,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
});

//====================================
// Buscar productos
//====================================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    
    let termino = req.params.termino;
    // i: Para que sea insensible a mayus y minus
    let regex = new RegExp(termino, 'i');
    
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {

            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
})

//====================================
// Crear un nuevo producto
//====================================
app.post('/productos', verificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoriaID,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

//====================================
// Actualizar un nuevo producto
//====================================
app.put('/productos/:id', verificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    
    let id = req.params.id;
    let body = req.body;

    let data = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion
    }

    let options = {
        new: true, 
        runValidators: true
    };

    Producto.findByIdAndUpdate(id, data, options, (err, productoDB) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

//====================================
// Borrar un producto
//====================================
app.delete('/productos/:id', verificarToken, (req, res) => {
    // disponible: false
    // grabar el usuario
    // grabar una categoria del listado
    
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, productoDeleted) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if( productoDeleted === null ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDeleted
        })
    })
});

module.exports = app;