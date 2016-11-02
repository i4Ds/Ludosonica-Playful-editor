var express = require('express');
var router = express.Router();

var glob = require('glob');

var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
	var db = new sqlite3.Database( GLOBAL.db );

	// console.log(req.session.userid);

	var scenes = [];
	
	db.serialize(function() {

		//db.each("SELECT * FROM scene WHERE user_id != ? ORDER BY id DESC LIMIT ?", 1, [ GLOBAL.maxScenesOnFrontPage ], function(err, row) {
		db.each("SELECT * FROM scene WHERE user_id != (SELECT id FROM users WHERE email = ?)", GLOBAL.email, function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else{
				scenes.push( row );
			}
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});

	});


	db.serialize(function() {
		var rows = [];
		db.each("SELECT * FROM scene WHERE user_id = (SELECT id FROM users WHERE email = ?)", GLOBAL.email, function(err, row) {
			if(err){
				console.log('first', err);
				var error = new Error(err);
				next(error);
			}else{
				rows.push( row );
			}
		}, function(err, rowcount ){
			if(err){
				console.log('second', err);
				var error = new Error(err);
				next(error);
			}else{
				res.render( 'index', { scenes: scenes, user_scenes: rows, host: req.headers.host } );
			}
		});

	});

});


// Copy scenes of others
router.post('/copy_other', function(req,res) {

	console.log('before');

	if( req.param('scene') !== undefined ){

		db.serialize(function () {

			db.run("CREATE TEMPORARY TABLE temp_table_other as SELECT * FROM scene where id=?", req.param('scene'));
			db.run("UPDATE temp_table_other SET id = NULL, user_id = (SELECT id FROM users WHERE email =?)",GLOBAL.email);
			db.run("INSERT INTO scene SELECT * FROM temp_table_other");
			db.run("DROP TABLE temp_table_other");

		});


		var stmt = db.prepare("INSERT INTO users ( id, name, email, password, salt) VALUES (NULL, ?, ?, ?, ?)");
		stmt.run([ name, hashEmail(email,'salt'), hashPassword(password,'salt'), 'salt'], function(error){
			if(error) {
				res.render('register', {
					error: 'Email is already taken'
				});
			} else {
				req.flash('success_msg','You are registered and can now login');
				res.redirect('/play/gallery/login');
			}
		}).finalize();

		console.log('after');
		res.render('index');

	}
});

module.exports = router;
