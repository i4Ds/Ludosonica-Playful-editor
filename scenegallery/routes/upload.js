var util = require('util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var JSZip = require("jszip");

var crypto = require('crypto');

var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var form = require('reformed');

var sqlite3 = require('sqlite3').verbose();


//var MAX_SIZE = 99999999999999;
//var MAX_SIZE = 8 * 1000 * 1024;



var busconfig = {
    limits: {
		immediate: true,
        fields: 30, //non-multipart fields
        parts:  10 //multipart fields
        //fileSize: MAX_SIZE // files can be at most MAX_SIZE MB each
    }
};


var formconfig = {
	images: {
		multiple: false,
		buffered: true,
		maxSize: {
			size: GLOBAL.max_size,
			error: ('file size too large (must be '+ (GLOBAL.maxSize/1000000) +' MB or less)')
		}
    },
    playful: {
		multiple: false,
		required: true,
		buffered: true,
		maxSize: {
			size: GLOBAL.maxSize,
			error: ('file size too large (must be '+ (GLOBAL.maxSize/1000000) +' MB or less)')
		}
    },
	scenename:{		
		required: true,
		rules: [
               { test: /^.{1,50}$/,
                 error: 'Scenename  must be between 1 and 50 characters' }
             ]
    },
	description:{
		required: true,
		rules: [
               { test: /^[a-zA-Z0-9\s\S.]{0,500}$/,
                 error: 'Description must be 500 characters or less' }
             ]
    },
	user:{
		required: true
	},
	scene:{
		required: true
	}
	//captcha:{
	//	required: true
	//}
};


var check = function(err, req, res, next) {
	
	// recaptcha.verify(function(success, error_code) {
		// if (success) {
		
			if (!err || (err && err.key)){
				next(); // no error or validation-related error
			}else{
				next(err); // parser or other critical error
			}
		// }else {
			// return res.send(400, 'Recaptcha is wrong! "');
		// }			
	// });

    
};


var process = function(req, res, next) {

	if (req.form.error) {
			console.log('Form error for field "' + req.form.error.key+ '": '+ req.form.error);
			
			return res.status(400).send({'error-codes':'Form error for field "'+ req.form.error.key + '": '+ req.form.error});
	}		

	//console.log('captcha:'+req.form.data.captcha);
	
     
	var resp_token = req.form.data.captcha;
	var resp_token = 'captcha';
	var user_ip    = req.connection.remoteAddress;
		
	//console.log(resp_token);
	//console.log("ip:"+user_ip);
	
	var captchaSuccess = function(){

		var s = {};

		s['db'] = 'before';

		//make directory
		var timestamp = new Date().toUTCString();
		var shasum = crypto.createHash('sha256');
		//shasum.update( req.form.data.email + req.form.data.name + timestamp );
		shasum.update( req.form.data.scenename + timestamp );
		var locationHash = shasum.digest('hex');
		var location = 'content/'+locationHash+'/';
		var path = './public/'+location;
		
		//hash remove link
		shasum = crypto.createHash('sha256');
		var rndm = crypto.randomBytes(256);
		shasum.update( locationHash + rndm );
		var removeHash = shasum.digest('hex');	
		
		// //hash email
		// shasum = crypto.createHash('sha256');
		// shasum.update( req.form.data.email );
		// req.form.data.email = shasum.digest('hex');		
		
		mkdirp( path, function (err) {
			if (err) {
				console.error(err);
				s['error-codes'] = 'Folder: "mkdir" Exception!';
				return res.status(400).send(s);				
			}else{
					
				//console.log(req.form.data.playful.data);
				//console.log(req.form.data.playful.size);
				writeFile( path+'playful.playful', req.form.data.playful.data, req.form.data.playful.size );
				
				//extract images
				//console.log(req.form.data.images.size);
				var zip = new JSZip( req.form.data.images.data );
				var images = zip.folder("images").file(/.*\.png/);				
				
				for(var i = 0; i < images.length; i++ ){
					//console.log(images[i].name);
					var data = images[i].asNodeBuffer();
					//console.log(data);
					writeFile( path+'image'+i+'.png', data, data.length );
				}
				

				//if()
				var db = new sqlite3.Database( GLOBAL.db );
				db.serialize(function() {

					var userId = parseInt(req.form.data.user);
					var sceneId = ( req.form.data.scene === 'null' ) ? null : parseInt(req.form.data.scene);

					//stmt.run([ 51, 'descr', 'a wonderfuller name', 'text', 'text', 'text', 0, 16 ], function(error){
					var stmt = db.prepare("INSERT OR REPLACE INTO scene ( id, description, name, location, timestamp, removehash, images, user_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
					stmt.run([ sceneId, req.form.data.description, req.form.data.scenename, location, timestamp, removeHash, images.length, userId ], function(error){
						if(error) {
							s['error-codes'] = error;
							return res.status(400).send(s);
							//console.log(error);
							//var err = new Error(err);
							//next(err);
						}else {
							s['db'] = 'wuhu no error!';
						}
					}).finalize();
				});

                //
				//var sceneType = typeof req.form.data.scene;
				//var userType = typeof req.form.data.user;

				db.close();
				s['link']   = 'http://'+req.headers.host+'/'+location;
				s['remove'] = 'http://'+req.headers.host+'/play/gallery/remove?hash='+removeHash;
					s['success'] = 'scene '+req.form.data.scene + ' of user '+ req.form.data.user + ' saved.';
				console.log(s);
				res.status(200).send(s);
			}
		});	
	};
	
	//GLOBAL.useCaptchaSession( resp_token, captchaSuccess, function(s){
	//	res.status(400).send(s);
	//});

	captchaSuccess();
	
	// GLOBAL.checkCaptcha(resp_token, user_ip,  captchaSuccess, function(s){		
		// return res.status(400).send(s);		
	// });
	 
	

};


function writeFile( path, buffer, size, response ){
    fs.open( path, 'w', '0666', function(err, fd, ri){
		if(err){
			console.error(err);
			return res.status(400).send(err);
		}else{		
			fs.write(fd, buffer, 0, size, null, function(err, written, buffer){
				if(err){
					console.error(err);
					return res.status(400).send(err);
				}
				fs.close(fd, function( err ){
					if(err){
						console.error(err);
						return res.status(400).send(err);
					}
				});
			});
		}
    });
}

router.route('/play/gallery/upload').post( busboy( busconfig ), form( formconfig ), check, process  );


module.exports = router;





