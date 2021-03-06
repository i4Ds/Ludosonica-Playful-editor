var express = require('express');
var router = express.Router();


//Get homepage
router.get('/', ensureAuthenticated, function(req,res) {
	res.render('index.html');

});

function ensureAuthenticated(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/play/gallery/login');
	}
}

module.exports = router;