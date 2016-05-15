/**
 * Created by administrator on 4/21/16.
 */

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var morgan = require('morgan');
var compression =  require('compression');
var flash = require('connect-flash');

// Set express properties
app.set('appName', 'Map Server');
app.set('port', process.env.PORT || 3000);
// Set out vew engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Hide Express from http
app.disable('x-powered-by');

app.use('/css', express.static('css'));
app.use('/data', express.static('data'));
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));

// Initialize Express Middleware
app.use(bodyParser.
        json({strict:false,
              type:'application/json'}));
app.use(bodyParser.
        urlencoded({extended:true}));
app.use(cookieParser());
app.use(expressSession({secret: process.env.SERVER_SECRET ||'S2wRePaRave7@ceSp7XeF4tha',
                        resave: true,
                        saveUninitialized: true,
                        name: 'espa-id'
}));

// Are we in development or production;
var mode = process.env.NODE_ENV || 'development';
if(mode=='development')
    app.use(morgan('dev'));
else
    app.use(compression());

// Use flash are messages
app.use(flash());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize our authentication strategy
passport.use( new LocalStrategy({
        usernameField : 'username',
        passwordField : 'email'
    },function(username,password,done){
        if (!username) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        // Use database layer
        if (username==password){
            console.log('Successfully authenticated');
            done(null,{
                username:username,
                name:'Paschalis Thriskos',
                id:1
            });
        }
        else // Invalid credentials
           // done(new Error('Incorrect Credentials'));
            done(null,null);
    /*    console.log('Not authenticated');
        console.log('Successfully authenticated');
        done(null,{username:username,name:'Paschalis Thriskos',id:1})*/
    }));

// Serialization of user object
passport.serializeUser(function(user, done) {
    console.log("Serializing:", user);
    done(null,user.id);
});
// Deserialization of user object
passport.deserializeUser(function(id, done) {
    console.log('Deserializing',id);
       done(null,{
           username:'1234',
           name:'Paschalis Thriskos',
           id:id
       });
});

var _baseUrl = 'http://certlogon.mnec.gr';
function checkAuthentication(req,res,next) {
    if (req.isAuthenticated())
        next();
    else
        res.redirect('/login');
}

// Connect to Mongo DB
mongoose.connect('mongodb://localhost/local')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

var Users = require('./models/users')(mongoose);

// static middleware definition
app.use('/services',
        checkAuthentication,
        require('./modules/services'));


app.get('/',passport.authenticate('local',{failureRedirect: '/login'}));

app.get('/login',function(request,response){
    response.render('login',{message: request.flash('error')});
});

//app.post('/login', passport.authenticate('local',{failureRedirect: '/login',successRedirect: '/services'}));
app.post('/login',passport.authenticate('local',{failureRedirect: '/login',successRedirect: '/services',failureFlash : true}));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(app.get('port'),function(){
    console.log('Application Server started and listening at port :'+app.get('port'));
})