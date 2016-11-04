var express = require('express');
var router = express.Router();

var glob = require('glob');

var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
	var db = new sqlite3.Database( GLOBAL.db );


	var scenes = [];
	
	db.serialize(function() {

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
							req.flash('error_msg','Opps, something went wrong please try again');
							console.log(error);
							var err = new Error(error);
							next(err);
						}else{
							req.flash('success_msg','Your scene has been succesfully cloned');
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

// //Save scene
// router.post('/save', function(req,res,call) {
	
// 	db.serialize(function () {
// 	db.run("CREATE TEMPORARY TABLE scene_temp ( id INTEGER, description TEXT , name TEXT , location TEXT , timestamp TEXT  , removehash TEXT  , images INT  , user_id INT, FOREIGN KEY (user_id) REFERENCES users (id) )");
// 	db.run("CREATE TEMPORARY TABLE temp_table_save AS SELECT id FROM users where id= (SELECT id FROM users WHERE email =?)", GLOBAL.email);


// 		var stmt = db.prepare("INSERT INTO scene_temp ( id, description, name, location, timestamp, removehash, images,user_id ) VALUES (NULL, ?, ?, ?, ?, ?, ?,?)");
// 	stmt.run([ 'text', 'text', 'text', 'text', 'text', 123, 1 ],function(error){
		
// 	}).finalize();
// 	 db.run("UPDATE scene_temp SET id=NULL, user_id = (SELECT id FROM temp_table_save)");
// 	 db.run("INSERT INTO scene SELECT * FROM scene_temp");
// 	 db.run("DROP TABLE temp_table_save");
// 	 db.run("DROP TABLE scene_temp",
// 	 	function(error){
// 					if(error) {
// 						req.flash('error_msg','Opps, something went wrong please try again');
// 						console.log(error);
// 						var err = new Error(error);
// 						next(err);
// 					}else{
// 						req.flash('success_msg','Scene has been succesfully created');
// 						res.redirect('/play/gallery/main');
// 					}}
// 	 	);

// });

// });

});


module.exports = router;
