const localStrategy = require('passport-local').Strategy;
const mysql = require("mysql");
const bcrypt = require("bcrypt-nodejs");

var credenciales={
    host : "localhost",
    user : "root",
    password : "",
    database : "db_drive"
}

var conection = mysql.createConnection(credenciales);

module.exports = function(passport){
    
    passport.serializeUser(function(user, done){
        done(null,user.codigo_usuario);
    });

    passport.deserializeUser(function(id, done){
        conection.query("select * from tbl_usuario where codigo_usuario = "+ id, function(err,rows){
          done(err,rows[0]);        
        });
    });

    //registrarse
    passport.use('registro-local', new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },function(req,email,password,done){
          conection.query("select * from tbl_usuario where correo = '"+ email +"'",function(err,rows){
            if(err){return done(err);}
            if(rows.length){
                return done(null,false,req.flash('registroMensaje','el email ya exite!'));
            }else{
                var usuario = new Object();
                usuario.email = email;
                usuario.password = bcrypt.hashSync(password,bcrypt.genSaltSync(10));
                usuario.nombre = req.body.nombre;
                usuario.apellido = req.body.apellido;
                
                var insertar = "insert into tbl_usuario(codigo_almacenamiento,nombre,apellido,correo,password) values(?,?,?,?,?)";
                conection.query(insertar,[1,usuario.nombre,usuario.apellido,usuario.email,usuario.password],function(err,rows){                
                   
                    usuario.codigo_usuario = rows.insertId;

                    return done(null, usuario);    
                });
            }
        });
    }));
 
    //ingresar
    passport.use('ingreso-local', new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req,email,password,done){
        conection.query("SELECT  * FROM tbl_usuario WHERE correo = ?",[email],
        function(err,user){             
            if(err){
                return done(err);
            }
            if(!user.length){
                return done(null,false,req.flash('ingresoMensaje','usuario no encontrado!'));
            }
            if(!bcrypt.compareSync(password,user[0].password)){
                return done(null,false,req.flash('ingresoMensaje','contraseña incorrecta!'));
            }
            return done(null, user[0]); 
        });
    }));
}

    
    
    