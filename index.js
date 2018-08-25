var express = require("express");
var app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require("express-fileupload");
const fs = require("fs");

require("./config/config");
require('./config/passport')(passport);

//settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret:'jairoeselmejor1991',
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(fileUpload());

//routes
require('./routes/routes')(app,passport,fs);

//static file
app.use(express.static(path.join(__dirname,"public")));

app.listen(app.get('port'),()=>{
    console.log("servidor arriba escuchando en: "+ process.env.PORT);
});

//fileUpload

    
    /*if(!req.files){ 
        return res.status(400)
        .json({
            ok :false,
            err : {
                message:'no se ha seleccionado nungun archivo'
            }
        });
    }
    let archivo = req.files.archivo;

    archivo.mv('/archivo_guardado/file',(err)=>{
        if(err)
        return res.status(500).json({
            ok:false,
            err
        })
        res.send('archivo guardado');
    });*/

