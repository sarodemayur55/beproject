var express = require('express');
var router = express.Router();
var Image = require('../models/image')
const path = require("path");
const multer = require("multer");
const formidable = require('formidable');
require('dotenv').config()
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function (passport) {

	/* GET login page. */
	// router.get('/', function(req, res) {
	// 	// Display the Login page with any flash message, if any

	// 	res.json({message:"Logged "})
	// });

	/* Handle Login POST */
	router.post('/login', function (req, res, next) {
		passport.authenticate('login', function (err, user, info) {
			if (err) {
				return res.status(400).send({ message: 'Auth Failed' })
			}
			if (!user) {
				return res.status(400).send({ message: 'Auth Failed' })
			}
			console.log(user)
			console.log("Printed")
			//   req.user=user;
			console.log("yt")
			console.log(req.user)
			console.log("yt")
			req.session.user = req.user;
			return res.json({ user, info })
		})(req, res, next)
	});
	router.get('/loggedin', function (req, res) {
		console.log("Logged In")
		console.log(req.session.user)
		res.json(req.session.user)
	});
	/* GET Registration Page */
	router.get('/signup', function (req, res) {
		res.render('register', { message: req.flash('message') });
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function (req, res) {
		res.json({ message: "Signed Up" })
		// res.render('home', { user: req.user });
	});

	/* Handle Logout */
	router.get('/logout', function (req, res, next) {
		// req.session = null;
		// req.logout(function(err) {
		// 	if (err) { return next(err); }
		// 	res.redirect('/');
		//   });
		res.clearCookie("session", { path: "/" });
		return res.redirect('/')
		// res.clearCookie("session.sig", { path: "/" });
		// res.cookie("session", "", {
		// 	// maxAge: sevenDaysToSeconds,
		// 	httpOnly: false,
		// 	Secure:true,
		// 	expires: new Date(Date.now()),
		// 	overwrite: true
		//   }) 
		// req.session.destroy(function (err) {
		// 	res.clearCookie('connect.sid');
		// 	return res.send({ message: "Logged Out" })
		// });
		return res.send({ message: "Logged Out" });
		
		req.logout(function (err) {
			// res.clearCookie('connect.sid');
			// delete req.session;
			req.session = null;
			if (err) { return next(err); }
			res.send({ message: "Logged Out" })
		})
	});
	router.get('/status', (req, res) => {
		// return res.json(req.session.user)
		console.log(req.session.user);
		let temp = req.session.user;
		if (req.session.user) {
			console.log(req.session.user);
			res.send({ user: req.session.user })
		}
		else {
			// console.log(req.user);
			return res.status(400).send({ message: "Not Logged In" });
		}
	})


	// Image Upload Routes



	String.prototype.toObjectId = function () {
		var ObjectId = (require('mongoose').Types.ObjectId);
		return new ObjectId(this.toString());
	};
	router.post('/uploadimage', (req, res) => {
		// console.log(req.body);
		var url = req.body.url;
		var result = "ok";
		// return res.send({url:url,user:req.session.user});


		Image.findOne({ userid: req.session.user._id.toObjectId() }, (err, obj) => {
			console.log(err);
			// console.log(obj)
			if (!obj) {
				var obj = new Image();
				obj.userid = req.session.user._id.toObjectId();

			}
			obj.images.push({ url, result })
			obj.save((err) => {
				if (err)
					console.log(err);
				else {
					console.log("Donee")
					res.send(obj);
				}
			});
		})
	});

	// const storage = multer.diskStorage({
	// 	destination: "./tmp/",
	// 	filename: function (req, file, cb) {
	// 		cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
	// 	}
	// });

	// const upload = multer({
	// 	storage: storage,
	// 	limits: { fileSize: 1000000 },
	// }).single("myImage");

	router.get('/getawskeys',(req,res)=>{
		res.send({ACCESS_KEY:process.env.ACCESS_KEY,SECRET_ACCESS_KEY:process.env.SECRET_ACCESS_KEY})
	})

	router.post("/processimage", (req, res) => {


		const form = formidable({ multiples: true });

		form.parse(req, (err, fields, files) => {
			if (err) {
				next(err);
				return;
			}
			console.log(files);
		});



		// console.log("Test")
		// console.log(req.files);
		// // return;


		// console.log("Request file ---", req.file);
		// // return res.send(200).end();
		// upload(req, res, (err) => {
		// 	//Here you get file.
		// 	console.log("Request file ---", req.file);
		// 	/*Now do where ever you want to do*/
		// 	if(!err)
		// 	   return res.send(200).end();
		//  });
	});


	return router;
}