const Campground = require("../models/campgroundSchema");
const Comment    = require("../models/commentSchema");
const middlewareObject = {};

// MiddleWare to check campground ownership
middlewareObject.checkCampgroundOwnership = function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err,foundCampground)=>{
			if(err || !foundCampground){
				req.flash("error","Campground Not Found !!!");
				res.redirect("/campgrounds");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
				next();
			} 	else {
				res.redirect("back");
			}
			}
		});
	} else {
		res.redirect("back");
	}
	
};




// MiddleWare to check login/logout Status
middlewareObject.isLoggedIn = function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("specialErrors","You need to be logged in !!!");
		res.redirect("/login");
	}
};



//MiddleWare to check comment Ownership
middlewareObject.checkCommentOwnership = function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentId, (err,foundComment)=>{
			if(err || !foundComment){
				req.flash("error","Comment not found !");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
			}
			
		})
	} else {
		res.redirect("back");
	}
}

module.exports = middlewareObject;