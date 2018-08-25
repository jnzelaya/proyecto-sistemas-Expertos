
const mysql = require("mysql");
var credenciales={
    host : "localhost",
    user : "root",
    password : "",
    database : "db_drive"
}

var newconection = mysql.createConnection(credenciales);

module.exports = (app , passport,fs) => {
    app.get('/',(req,res)=>{
        res.render('index');
    });

    app.get('/login',(req,res)=>{
        res.render('login',{
            message : req.flash('ingresoMensaje')
        });
    });
    
    app.post('/login', passport.authenticate('ingreso-local',{
        successRedirect: '/editor',
        failureRedirect : '/login',
        failureFlash : true,
        
    }));


    app.get('/registro',(req,res)=>{
        res.render('registro',{
            message : req.flash('registroMensaje')
        });
    });

    app.post('/registro', passport.authenticate('registro-local',{
        successRedirect: '/editor',
        failureRedirect : '/registro',
        failureFlash : true
    }));
    
    app.get('/editor',accesoSeguro,(req,res)=>{
        res.render('editor',{
            user: req.user
        });
    });

    function accesoSeguro(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/');
    };

    app.post('/guardar',function(req,res){    
            var nombre = `${new Date().getMilliseconds()}-${req.body.nombre}`;
            var exten = `img/iconos/${req.body.nombre.split(".")[1]}`;
            fs.appendFile(`archivo_guardado/${nombre}`,req.body.texto,(err)=>{
            if(err){
                throw err;
            }
            var sql = 'INSERT INTO tbl_archivo (codigo_propietario, nombre_archivo, icono,fecha_creacion, Archivo) VALUES (?,?,?,sysdate(),?)';
            newconection.query(sql,[req.session.passport.user,nombre,exten,`archivo_guardado/${nombre}`],function(err,row){
               if(err){
                   throw err;
               } 
               return row; 
            });          
        });  
        res.send();  
    });

    app.get('/salir',(req,done)=>{
        req.logout();
        done.redirect("/");
    });

    //aqui obtenemos los archivos que no estan en la papelera de reciclaje
    app.get('/archivos',function(req,res){
        var sql = "SELECT codigo_archivo, codigo_propietario, nombre_archivo,icono, fecha_creacion, Archivo, favorito FROM tbl_archivo WHERE codigo_propietario =? and estado=1";
        newconection.query(sql,[req.session.passport.user],function(err,archivos){
            console.log(archivos);
            if(err){
                throw err;
            } 
            res.send(archivos); 
         });
    });

    //obtener archivos que estan en la papelera de reciclaje
    app.get('/archivosReciclaje',function(req,res){
        var sql = "SELECT codigo_archivo, codigo_propietario, nombre_archivo,icono, fecha_creacion, Archivo, favorito FROM tbl_archivo WHERE codigo_propietario =? and estado=0";
        newconection.query(sql,[req.session.passport.user],function(err,archivos){
            console.log(archivos);
            if(err){
                throw err;
            } 
            res.send(archivos); 
         });
    });

    //cambiamos el estado del archivo para mandarlo a la papelera de reciclaje
    app.post("/eliminarArchivo",function(req,res){
       let id=req.body.id;
       newconection.query("Update tbl_archivo set estado=0 where codigo_archivo=?",[id],function(error,resultado){
           if(error){
               throw error;
           }else{               
               console.log(resultado);
               res.send();
           }
       })
    })
    //restauramos el archivo al estado 1 
    app.post("/restaurarArchivo",function(req,res){
        let id=req.body.id;
        newconection.query("Update tbl_archivo set estado=1 where codigo_archivo=?",[id],function(error,resultado){
            if(error){
                throw error;
            }else{
                console.log(resultado)
                res.send();
            }
        })
     })

     app.post('/eliminarReciclaje',function(req,res){ 
        newconection.query("select nombre_archivo from tbl_archivo where codigo_archivo = "+req.body.id,function(err,row){
             if (err) {
                 throw err;
             }
             else{
                let archivo = row[0].nombre_archivo;
                fs.unlink("./archivo_guardado/"+archivo,function (err) {
                    if (err) {
                        throw err;
                    }
                    else{
                        newconection.query("delete from tbl_archivo where codigo_archivo="+req.body.id,function(err,row){
                            if (err) {
                                throw err;
                            }else{
                                res.send({
                                    mensaje:"Archivo elimindo "    
                                });
                            }
                        });
                    }
                  })
             }             
        });

     });
    
};  