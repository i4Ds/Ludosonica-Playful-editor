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


	// Copy my scenes
	router.post('/copy_own', function(req,res) {

		if( req.param('scene') !== undefined ){

			db.serialize(function () {

				db.run("CREATE TEMPORARY TABLE temp_table_own as SELECT * FROM scene where id=?", req.param('scene'));
				db.run("UPDATE temp_table_own SET id = NULL, user_id = (SELECT id FROM users WHERE email =?)",GLOBAL.email);
				db.run("INSERT INTO scene SELECT * FROM temp_table_own");
				db.run("DROP TABLE temp_table_own",
					function(error){
						if(error) {
							console.log(error);
							var err = new Error(error);
							next(err);
						}else{
							console.log('success');
							res.redirect('/play/gallery/main');
						}}
				);

			});

		}
	});


	//Save scene
	router.post('/upload_test', function(req,res,call) {

		db.serialize(function() {
			var stmt = db.prepare("INSERT OR REPLACE INTO scene ( id, description, name, location, timestamp, removehash, images, user_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
			stmt.run([ undefined, 'descr', 'wuhuu', 'text', 'text', 'text', 0, 16 ], function(error){
				if(error) {
					//s['error-codes'] = error;
					//return res.status(400).send(s);
					console.log(error);
					//var err = new Error(err);
					//next(err);
				}else {
					//s['input'] = 'wuhu no error!';
					console.log('wuhu saved');
				}
			}).finalize();
		});


		db.close();

	});


// Copy scenes of others
router.post('/copy_other', function(req,res) {

	console.log('before');
	console.log(req.param('scene'));

	if( req.param('scene') !== undefined ){

		db.serialize(function () {

			db.run("CREATE TEMPORARY TABLE temp_table_other as SELECT * FROM scene where id=?",
				req.param('scene'),
				function(error){
					if(error) {
						console.log(error);
						var err = new Error(error);
						next(err);
					}else{
						console.log('success create temp');
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
						console.log('success update');
					}}
			);
			db.run("INSERT INTO scene SELECT * FROM temp_table_other",
				function(error){
					if(error) {
						console.log(error);
						var err = new Error(error);
						next(err);
					}else {
						console.log('success instert');
					}}
			);
			db.run("DROP TABLE temp_table_other",
				function(error){
					if(error) {
						console.log(error);
						var err = new Error(error);
						next(err);
					}else{
						console.log('success');
						res.redirect('/play/gallery/main');
					}}
			);

		});

	}
});

});


module.exports = router;
