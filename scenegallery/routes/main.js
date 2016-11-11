var express = require('express');
var router = express.Router();

var glob = require('glob');

var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
	var db = new sqlite3.Database( GLOBAL.db );


	var scenes = [];
	
	db.serialize(function() {
		   db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_id != (SELECT id FROM users WHERE email = ?) ORDER BY datetime(timestamp) DESC LIMIT ?",GLOBAL.email,[ GLOBAL.maxScenesOnFrontPage ],function(err,row){
		// db.each("SELECT * FROM scene WHERE user_id != (SELECT id FROM users WHERE email = ?) ORDER BY timestamp DESC", GLOBAL.email, function(err, row) {
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
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_id = (SELECT id FROM users WHERE email = ?) ORDER BY datetime(timestamp) DESC LIMIT ?",GLOBAL.email,[ GLOBAL.maxScenesOnFrontPage ], function(err,row) {
		// db.each("SELECT * FROM scene WHERE user_id = (SELECT id FROM users WHERE email = ?) ORDER BY timestamp DESC", GLOBAL.email, function(err, row) {
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

	// Copy my scenes
	router.post('/copy_own', function(req,res) {

		if( req.param('scene') !== undefined ){

			db.serialize(function () {

				var timestamp = new Date().toString().replace(' GMT+0100 (CET)', '');
				db.run("CREATE TEMPORARY TABLE temp_table_own as SELECT * FROM scene where id=?", req.param('scene'));
				db.run("UPDATE temp_table_own SET id = NULL, user_id = (SELECT id FROM users WHERE email =?)",GLOBAL.email);
				db.run("UPDATE temp_table_own SET timestamp = ?",timestamp);
				db.run("UPDATE temp_table_own SET name = name || '_clone' WHERE user_id = (SELECT id FROM users WHERE email =?)",GLOBAL.email);
				db.run("INSERT INTO scene SELECT * FROM temp_table_own");
				db.run("DROP TABLE temp_table_own",
					function(error){
						if(error) {
							req.flash('error_msg','Opps, something went wrong please try again');
							console.log(error);
							var err = new Error(error);
							next(err);
						}else{
							req.flash('success_msg','Your scene has been succesfully cloned');
							res.redirect('/play/gallery/main');
						}}
				);

				// db.run("ALTER TABLE scene ADD user_name TEXT");
				// db.run("UPDATE TABLE scene INNER JOIN users ON scene.user_id = users.id SET scene.user_name = users.name");

			});

		}
	});


// Copy scenes of others
router.post('/copy_other', function(req,res) {

	if( req.param('scene') !== undefined ){

		db.serialize(function () {
			var timestamp = new Date().toString().replace(' GMT+0100 (CET)', '');
			db.run("CREATE TEMPORARY TABLE temp_table_other as SELECT * FROM scene where id=?",
				req.param('scene'),
				function(error){
					if(error) {
						console.log(error);
						var err = new Error(error);
						next(err);
					}else{
					}}
			);
			db.run("UPDATE temp_table_other SET id = NULL, user_id = (SELECT id FROM users WHERE email =?)",
				GLOBAL.email,
				function(error){
					if(error) {
						console.log(error);
						var err = new Error(error);
						next(err);
					}else{
					}}
			);
			db.run("UPDATE temp_table_other SET timestamp = ?",timestamp);
			db.run("UPDATE temp_table_other SET name = name || '_copy' WHERE user_id = (SELECT id FROM users WHERE email =?)",GLOBAL.email);
			db.run("INSERT INTO scene SELECT * FROM temp_table_other",
				function(error){
					if(error) {
						console.log(error);
						var err = new Error(error);
						next(err);
					}else {
					}}
			);
			db.run("DROP TABLE temp_table_other",
				function(error){
					if(error) {
						req.flash('error_msg','Opps, something went wrong please try again');
						console.log(error);
						var err = new Error(error);
						next(err);
					}else{
						req.flash('success_msg','Scene has been succesfully copied');
						res.redirect('/play/gallery/main');
					}}
			);

		});

	}
});


});


module.exports = router;
