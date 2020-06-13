const express    = require("express");
const router     = express.Router({mergeParams:true});
const Campground = require("../models/campgroundSchema");
const User       = require("../models/users");
const Comment    = require("../models/commentSchema");
const passport   = require("passport");


// Get the Landing Page
router.get("/",(req,res)=>{
	res.render("landingPage");
});
 
// Getting the Signup Form 
router.get("/register", (req,res)=>{
	res.render("register");
});

// Handling the SignUp request
router.post("/register", (req,res)=>{
	User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, (err,user)=>{
		if(err){
			req.flash("specialErrors", err.message);
			return res.redirect("register");
		} else {
			passport.authenticate("local")(req,res,()=>{
				req.flash("success","Hi "+user.username+", Welcome to the YelpCamps !!!");
				res.redirect("/campgrounds");
			})
		}
	})
});

// Getting the Login form
router.get("/login", (req,res)=>{
	res.render("login");
});

// Handling the login request
router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash : "Invalid Username or Password",
	successFlash : "Welcome to the YelpCamps !!!"
	
}),(req,res)=>{
	
});

//Handling the LogOut request
router.get("/logout", (req,res)=>{
	req.logout()
	req.flash("success","You have successfully logged out !!");
	res.redirect("/login");
});

//Middleware to checker whether a user is logged in or logged out
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}

module.exports = router;