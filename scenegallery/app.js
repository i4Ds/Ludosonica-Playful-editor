var express = require('express');
var path = require('path');

//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

var app = express();


var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



var crypto = require('crypto');



GLOBAL.db = './gallery.db';
GLOBAL.captchaSessionTime = 600000; // 10 minutes
GLOBAL.maxSize = 50000000; // ~50 MByte
GLOBAL.maxScenesOnFrontPage = 100;
GLOBAL.root = __dirname;



var sqlite3 = require('sqlite3').verbose();



app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static(path.join(__dirname, 'public')));

var db = new sqlite3.Database(GLOBAL.db);

db.serialize(function () {
    db.run('PRAGMA foreign_keys = ON');
    // db.run("DROP TABLE users");
    // db.run("DROP TABLE scene");
    db.run("CREATE TABLE IF NOT EXISTS scene ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, description TEXT NOT NULL, name TEXT NOT NULL, location TEXT NOT NULL, timestamp TEXT NOT NULL, removehash TEXT NOT NULL, images INT NOT NULL, user_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users (id) )");
    db.run("CREATE TABLE IF NOT EXISTS captcha_session ( token TEXT PRIMARY KEY NOT NULL, timestamp INTEGER NOT NULL )");
    db.run("CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL,password TEXT NOT NULL,salt TEXT NOT NULL, CONSTRAINT email_unique UNIQUE (email) ) ");
});
db.close();


// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

//set up the folder
app.use(express.static(path.join(__dirname, 'public'))); //store the stylesheets, images...

//Express session

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect flash
app.use(flash());


//global variables for flash messages
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.errors = req.flash('errors');
    res.locals.users = req.user || null;
    next();
});




var routes = require('./routes/index');
app.use('/', routes);
var users = require('./routes/users');
app.use('/users', users);

// show newest Scenes
var main = require('./routes/main');
app.get('/play/gallery', main);


// //upload Scenes
// var upload = require('./routes/upload' );
// app.post('/play/gallery/upload', upload);

// //check captcha
// var captcha = require('./routes/captcha' );
// app.get('/play/gallery/captchacheck', captcha);

// //download Scenes
// var download = require('./routes/download' );
// app.get('/play/gallery/download', download);

// //remove Scenes
// var remove = require('./routes/remove');
// app.route('/play/gallery/remove').all(remove);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });




// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // res.render('error', {
        // message: err.message,
        // error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    // message: err.message,
    // error: {}
    // });
});


app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log('Server is running on port ' + app.get('port'));
});


// app.post('/login', passport.authenticate('local', { successRedirect: '/good-login',
//                                                     failureRedirect: '/bad-login' }));



module.exports = app;