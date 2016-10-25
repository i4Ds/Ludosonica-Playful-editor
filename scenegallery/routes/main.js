var express = require('express');
var router = express.Router();

var glob = require('glob');

var sqlite3 = require('sqlite3').verbose();

router.get('/play/gallery', function(req, res) {
	var db = new sqlite3.Database( GLOBAL.db );

	// console.log(req.session.userid);

	var scenes = [];
	
	db.serialize(function() {

		//db.each("SELECT * FROM scene WHERE user_id != ? ORDER BY id DESC LIMIT ?", 1, [ GLOBAL.maxScenesOnFrontPage ], function(err, row) {
		db.each("SELECT * FROM scene WHERE user_id != (SELECT id FROM users WHERE email = ?)",GLOBAL.email, function(err, row) {
			if(err){
				console.log(err);
			}else{
				scenes.push( row );
			}
		}, function(err, rowcount ){
			if(err){
				console.log(err);
			}
		});

	});


	db.serialize(function() {
		var rows = [];
		db.each("SELECT * FROM scene WHERE user_id = (SELECT id FROM users WHERE email = ?)", GLOBAL.email, function(err, row) {
			if(err){
				console.log('first', err);
			}else{
				rows.push( row );
			}
		}, function(err, rowcount ){
			if(err){
				console.log('second', err);
			}else{
				res.render( 'index', { scenes: scenes, user_scenes: rows, host: req.headers.host } );
			}
		});

	});
	db.close();
	

});

module.exports = router;
