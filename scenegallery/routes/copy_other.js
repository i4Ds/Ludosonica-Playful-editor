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
router.get('/copy_other', function(req,res) {
	res.render('copy_other');

});


// Copy scenes of others
router.post('/copy_other', function(req,res) {

	if( req.param('scene') !== undefined ){

db.serialize(function () {

	 db.run("CREATE TEMPORARY TABLE temp_table_other as SELECT * FROM scene where id=?", req.param('scene'));
	 db.run("UPDATE temp_table_other SET id = NULL, user_id = (SELECT id FROM users WHERE email =?)",GLOBAL.email);
	 db.run("INSERT INTO scene SELECT * FROM temp_table_other");
	 db.run("DROP TABLE temp_table_other");
	 
});
	
res.redirect('/play/gallery');

}
});


module.exports = router;