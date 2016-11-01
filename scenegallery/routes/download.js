var JSZip = require("jszip");
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var path = require('path');


router.get('/play/gallery/download', function( req, res ){
	console.log(req.param('load_scene'));
	//console.log("want:"+req.param( 'load_scene' ));
	if( req.param('load_scene') !== undefined ){
	
		var db = new sqlite3.Database( GLOBAL.db );
		db.serialize(function() {
			db.get("SELECT * FROM scene WHERE id = ?", req.param('load_scene'), function(err, row) {
				if( err === null ){
					var dir  = path.join( GLOBAL.root, '/public/'+row.location);
					var file = path.join( dir + 'playful.playful' );
					fs.exists( file, function(exists) {
						if(exists){
							fs.readFile(file, function(err, data) {
							  if (err) throw err;
							  var base64data = new Buffer(data).toString('base64');				
							  res.status(200).send( ""+base64data );
							});
							
						}
					});
				}
			});
		});
		
		
	
		//var zip = new JSZip(  );
		//res.send( 200, "load" );
	}
	//return res.status(404).send('Scene not Found!');	
	
});

module.exports = router;