var express = require('express');
var router = express.Router();
var Image = require('../models/image')
const path = require("path");
const multer = require("multer");
const formidable = require('formidable');
const { ObjectId } = require('mongodb');
require('dotenv').config()
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.status(400).send({message:"Not Authenticated"});
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
	// router.get('/signup', function (req, res) {
	// 	res.render('register', { message: req.flash('message') });
	// });

	/* Handle Registration POST */
	router.post('/signup', function (req, res, next) {
		passport.authenticate('signup', function (err, user, info) {
			console.log(err);
			console.log(user);
			console.log(info);
			if (err) {
				return res.status(400).send(info)
			}
			if (!user) {
				return res.status(400).send(info)
			}
			
			return res.json(info)
		})(req, res, next)
	});


	// router.post('/signup', passport.authenticate('signup', {
	// 	successRedirect: '/home',
	// 	failureRedirect: '/signup',
	// 	// failureFlash: true
	// }));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function (req, res) {
		res.json({ message: "Signed Up" })
	});

	/* Handle Logout */
	router.get('/logout', function (req, res, next) {
		res.clearCookie("session", { path: "/" });
		return res.redirect('/')
	});
	router.get('/status', (req, res) => {
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
		var result = req.body.result;
		var quality = req.body.quality;
		// var result = {
		// 	c1:"r1",
		// 	c2:"r2"
		// };
		// return res.send({url:url,user:req.session.user});


		Image.findOne({ userid: req.session.user._id.toObjectId() }, (err, obj) => {
			console.log(err);
			// console.log(obj)
			if (!obj) {
				var obj = new Image();
				obj.userid = req.session.user._id.toObjectId();

			}
			obj.images.push({ url, result, quality })
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

	// Get AWS Keys
	router.get('/getawskeys',(req,res)=>{
		res.send({ACCESS_KEY:process.env.ACCESS_KEY,SECRET_ACCESS_KEY:process.env.SECRET_ACCESS_KEY})
	})

	// Not in use currently
	router.post("/processimage", (req, res) => {


		const form = formidable({ multiples: true });

		form.parse(req, (err, fields, files) => {
			if (err) {
				next(err);
				return;
			}
			console.log(files);
		});
	});
	

	// Get History
	router.get('/history',(req,res)=>{
		if(!req.session.user)
		{
			return res.send({message:"Not Logged In"})
		}
		Image.findOne({ userid: req.session.user._id.toObjectId() }, (err, obj) => {
			console.log(err);
			// console.log(obj)
			if (!obj) {
				var obj = new Image();
				obj.userid = req.session.user._id.toObjectId();

			}
			obj.images.sort(function(a,b){
				// Turn your strings into dates, and then subtract them
				// to get a value that is either negative, positive, or zero.
				// console.log(a.time)
				return ((b.time) - (a.time));
			  });
			return res.send(obj);
		})
	})


	// Delete Image in history
	router.delete('/deleteimg/:id',(req,res)=>{
		const id = req.params.id;
		 // Access the collection
		//  const collection = db.collection(collectionName);

		 // Delete the document
		 Image.findOne({ userid: req.session.user._id.toObjectId() }, (err, obj) => {
			console.log(err);
			// console.log(obj)
			// if (!obj) {
			// 	var obj = new Image();
			// 	obj.userid = req.session.user._id.toObjectId();

			// }
			var ind=-1;
			for(var i=0;i<obj.images.length;i++)
			{
				// console.log(obj.images[i]._id)
				if(obj.images[i]._id.toString()==id)
				{
					ind=i;
					// console.log(i);
				}
			}
			if(ind!=-1)
			{
				obj.images.splice(ind,1);
				obj.save();
				return res.status(200).send({message:"Deleted Successfully"});
			}
			else
			{
				return res.status(404).send({message:"Not Found"});
			}
			console.log("HelloImg")
			
		})
	})

	return router;
}