var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

var sqlite3 = require('sqlite3').verbose();

GLOBAL.db = './gallery.db';
var db = new sqlite3.Database( GLOBAL.db );
// var db = new sqlite3.Database('./database.sqlite3');


 //Save
router.get('/save', function(req,res) {
	res.render('save');

});


//Save scene
router.post('/save', function(req,res,call) {
	
	db.serialize(function () {
	db.run("CREATE TEMPORARY TABLE scene_temp ( id INTEGER, description TEXT , name TEXT , location TEXT , timestamp TEXT  , removehash TEXT  , images INT  , user_id INT, FOREIGN KEY (user_id) REFERENCES users (id) )");
	db.run("CREATE TEMPORARY TABLE temp_table_save AS SELECT id FROM users where id= (SELECT id FROM users WHERE email =?)", GLOBAL.email);


		var stmt = db.prepare("INSERT INTO scene_temp ( id, description, name, location, timestamp, removehash, images,user_id ) VALUES (NULL, ?, ?, ?, ?, ?, ?,?)");
	stmt.run([ 'text', 'text', 'text', 'text', 'text', 123, 1 ],function(error){
		
	}).finalize();
	 db.run("UPDATE scene_temp SET id=NULL, user_id = (SELECT id FROM temp_table_save)");
	 db.run("INSERT INTO scene SELECT * FROM scene_temp");
	 db.run("DROP TABLE temp_table_save");
	 db.run("DROP TABLE scene_temp");


});

	res.redirect('/play/gallery');

});


module.exports = router;