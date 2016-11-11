var express = require('express');
var router = express.Router();

var glob = require('glob');

var sqlite3 = require('sqlite3').verbose();

router.get('/play/gallery/all_scenes', function(req, res) {
	var db = new sqlite3.Database( GLOBAL.db );


	
	db.serialize(function() {
		var rows = [];
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id ORDER BY timestamp DESC LIMIT ?", [ GLOBAL.maxScenesOnFrontPage ], function(err, row) {
			rows.push( row );		
		}, function(err, rowcount ){
			res.render( 'scenes', { scenes: rows, host: req.headers.host } );		
		});
		
	});	
	
	

});

module.exports = router;
