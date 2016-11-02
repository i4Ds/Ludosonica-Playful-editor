var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

var sqlite3 = require('sqlite3').verbose();

GLOBAL.db = './gallery.db';
var db = new sqlite3.Database( GLOBAL.db );
// var db = new sqlite3.Database('./database.sqlite3');


 //Copy
//router.get('/play/gallery/copy_own', function(req,res) {
//	res.render('index');
//
//});

// Copy my scenes
router.post('/play/gallery/copy_own', function(req,res) {

	if( req.param('scene') !== undefined ){

db.serialize(function () {

	 db.run("CREATE TEMPORARY TABLE temp_table_own as SELECT * FROM scene where id=?", req.param('scene'));
	 db.run("UPDATE temp_table_own SET id = NULL, user_id = (SELECT id FROM users WHERE email =?)",GLOBAL.email);
	 db.run("INSERT INTO scene SELECT * FROM temp_table_own");
	 db.run("DROP TABLE temp_table_own");
		
});

res.redirect('/play/gallery/main');
}
});

module.exports = router;