module.exports = (app , passport) => {
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
        failureFlash : true
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
};