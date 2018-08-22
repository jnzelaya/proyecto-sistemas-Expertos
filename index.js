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

require("./config/config")

//const { url } = require('./config/database');

//mongoose.connect(url);

require('./config/passport')(passport);

//settings
app.set(process.env.PORT || 3000);
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

//routes
require('./routes/routes')(app,passport);

//static file
app.use(express.static(path.join(__dirname,"public")));

app.listen(app.get(process.env.PORT),()=>{
    console.log("servidor arriba escuchando en: "+ process.env.PORT);
});