var express = require('express');
var router = express.Router();


var glob = require('glob');

var sqlite3 = require('sqlite3').verbose();

router.get('/', ensureAuthenticated,function(req, res) {
	var db = new sqlite3.Database( GLOBAL.db );


	var scenes = [];

	
				
	db.serialize(function() {

		   db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_id != ? ORDER BY timestamp DESC LIMIT 50000",req.user.id,function(err,row){
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
			db.each("SELECT * FROM scene WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50000", req.user.id, function(err, row) {
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
				res.render( 'index', { user: req.user.id, scenes: scenes, user_scenes: rows, host: req.headers.host, username: req.user.name } );

			}
		});

	});

	// Copy my scenes
	router.post('/copy_own', function(req,res) {

		if( req.param('scene') !== undefined ){

			db.serialize(function () {
				var date = new Date();
				date.setHours(date.getHours()+1);
				var timestamp = date.toISOString().replace(/T/, ' ').replace(/\..+/, ''); 

				db.run("INSERT INTO scene (description,name,location,timestamp,removehash,images,user_id) SELECT description,name || '_clone',location,?,removehash,images,user_id FROM scene WHERE id = ?",timestamp,req.param('scene'),
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


// Copy scenes of others
router.post('/copy_other', function(req,res) {

	if( req.param('scene') !== undefined ){

		db.serialize(function () {
			var date = new Date();
				date.setHours(date.getHours()+1);
				var timestamp = date.toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
			db.run("INSERT INTO scene (description,name,location,timestamp,removehash,images,user_id) SELECT description,name || '_copy',location,?,removehash,images,? FROM scene WHERE id = ?",timestamp,req.user.id,req.param('scene'),
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

	// Delete scene
	router.post('/delete', function(req,res) {

		if( req.param('scene') !== undefined ){

			db.serialize(function () {

				db.run("SELECT id FROM scene WHERE id=?",req.param('scene'));
				db.run("DELETE FROM scene WHERE id=?",req.param('scene'),
					function(error){
						if(error) {
							req.flash('error_msg','Opps, something went wrong please try again');
							console.log(error);
							var err = new Error(error);
							next(err);
						}else{
							req.flash('success_msg','Your scene has been succesfully deleted');
							res.redirect('/play/gallery/main');
							res.end();
						}}
				);

				// db.run("ALTER TABLE scene ADD user_name TEXT");
				// db.run("UPDATE TABLE scene INNER JOIN users ON scene.user_id = users.id SET scene.user_name = users.name");

			});

		}
	});


});

function ensureAuthenticated(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		// req.flash('error_msg','You are not logged in');
		res.redirect('/play/gallery/login');
	}
}


module.exports = router;
