

//================================
// Puerto
//================================
process.env.PORT = process.env.PORT || 3000;


//================================
// Entorno
//================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================================
// Base de datos
//================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:FB517xF8kN2PdMIS@cluster0.qtfnv.mongodb.net/cafe';
}

process.env.URLDB = urlDB;