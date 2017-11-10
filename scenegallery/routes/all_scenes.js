var express = require('express');
var router = express.Router();

var glob = require('glob');

var sqlite3 = require('sqlite3').verbose();

router.get('/play/gallery/all_scenes', function(req, res) {
	var db = new sqlite3.Database( GLOBAL.db );


	var all = [];
	var b_scenes = [];
	var c_scenes = [];
	var d_scenes = [];
	var e_scenes = [];
	var f_scenes = [];
	var g_scenes = [];
	var h_scenes = [];
	var i_scenes = [];
	var j_scenes = [];
	var k_scenes = [];
	var l_scenes = [];
	var m_scenes = [];
	var n_scenes = [];
	var o_scenes = [];
	var p_scenes = [];
	var q_scenes = [];
	var r_scenes = [];
	var s_scenes = [];
	var t_scenes = [];
	var u_scenes = [];
	var v_scenes = [];
	var w_scenes = [];
	var z_scenes = [];

	// all
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { all.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// b
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'B%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { b_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// c
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'C%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { c_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// d
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'D%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { d_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// e
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'E%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { e_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// f
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'F%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { f_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// g
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'G%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { g_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// h
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'H%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { h_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// i
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'I%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { i_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// j
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'J%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { j_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// k
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'K%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { k_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// l
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'L%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { l_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// m
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'M%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { m_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// n
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'N%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { n_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// o
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'O%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { o_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// p
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'P%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { p_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// q
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'Q%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { q_scenes.push( row );
			}			
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// r
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'R%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { r_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// s
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'S%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { s_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// t
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'T%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { t_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// u
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'U%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { u_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// v
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'V%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { v_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// w
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'W%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { w_scenes.push( row );
			}		
		}, function(err, rowcount ){
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}
		});
		
	});	

	// z
	db.serialize(function() {
		
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'Z%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { z_scenes.push( row );
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
			var a_scenes = [];
		db.each("SELECT scene.id,scene.description,scene.name,scene.location,scene.timestamp,scene.removehash,scene.images,users.name AS user_name FROM scene INNER JOIN users ON scene.user_id = users.id WHERE user_name LIKE 'A%' ORDER BY timestamp DESC LIMIT 50000", function(err, row) {
			
			if(err){
				console.log(err);
				var error = new Error(err);
				next(error);
			}else { a_scenes.push( row );	
			}	
		}, function(err, rowcount ){
			if(err){
				console.log(err); 
				var error = new Error(err);
				next(error);
			} else {
			res.render( 'scenes', { a_scenes: a_scenes, b_scenes: b_scenes,c_scenes: c_scenes, d_scenes: d_scenes, e_scenes: e_scenes,f_scenes: f_scenes, g_scenes: g_scenes,h_scenes: h_scenes, i_scenes: i_scenes, j_scenes: j_scenes, k_scenes: k_scenes, l_scenes: l_scenes,m_scenes: m_scenes, n_scenes: n_scenes, o_scenes: o_scenes, p_scenes: p_scenes, q_scenes: q_scenes,r_scenes: r_scenes, s_scenes: s_scenes, t_scenes: t_scenes, u_scenes: u_scenes, v_scenes: v_scenes,w_scenes: w_scenes, z_scenes: z_scenes,scenes:all, host: "www.cs.technik.fhnw.ch" } );
			}	
		});
		
	});	

	
	

});

module.exports = router;
