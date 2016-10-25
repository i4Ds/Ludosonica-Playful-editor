var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

var sqlite3 = require('sqlite3').verbose();

GLOBAL.db = './gallery.db';
var db = new sqlite3.Database( GLOBAL.db );
// var db = new sqlite3.Database('./database.sqlite3');

//Register
router.get('/register', function(req,res) {
	res.render('register');

});

 //Login
router.get('/login', function(req,res) {
	res.render('login');

});


//Register User
router.post('/save', function(req,res,call) {

	var stmt = db.prepare("INSERT INTO scene ( id, email, description, name, nickname, location, timestamp, removehash, images, user_id ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
	stmt.run([ 'text', 'text', 'text', 'text', 'text', 'text', 'text', 123, 1 ],function(error){
		if(error) {
			console.log(error);
		} else {
			console.log('success');
		}
	}).finalize();

});


//Register User
router.post('/register', function(req,res,call) {
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;
	var password2 = req.body.password2;

	
	//Validation 
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password', 'Password must have at least 6 characters').len(6,20);
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors){
		res.render('register', {
			errors: errors 
							});

	} else {
		var stmt = db.prepare("INSERT INTO users ( id, name, email, password, salt) VALUES (NULL, ?, ?, ?, ?)");
				   stmt.run([ name, email, hashPassword(password,'salt'), 'salt'],function(error){
						if(error) {
							res.render('register', {
								error: 'Email is already taken'								
							});
						} else {
							req.flash('success_msg','You are registered and can now login');
					 		res.redirect('/users/login');
						};
					}).finalize();
				
			
	}
});



// LOGIN 
function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

passport.use(new LocalStrategy({usernameField:'email'},function(email, password, done) {
  db.get('SELECT * FROM users WHERE email = ?', email, function(err, row) {
    if (!row) return done(null, false,{message: 'Unknown User'});
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', email, hashPassword(password,'salt'), function(err, row) {
    if (!row) return done(null, false,{message: 'Invalid password'});
      return done(null, row);
    });
  });
}));


// SERIALIZE AND DESERIALIZE USER
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT id, email FROM users WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});



router.post('/login', 
	passport.authenticate('local',
	{ successRedirect: '/play/gallery',failureRedirect: '/users/login',failureFlash:true }),
function(req,res) {
	res.redirect('/');

	

});

router.get('/logout',function(req,res){
	req.logout();

	req.flash('success_msg','You succesfully logged out');

	res.redirect('/users/login');
})


module.exports = router;