const express    = require("express");
const router     = express.Router({mergeParams:true});
const Campground = require("../models/campgroundSchema");
const Comment    = require("../models/commentSchema");
const middleWare = require("../middleware/index.js");

// Creating a new Comment
router.post("/",middleWare.isLoggedIn,(req,res)=>{
		
		Campground.findById(req.params.id,(err, foundCampground)=>{
			if(err){
				res.redirect("back");
			} else {
				Comment.create(req.body.comment,(err, createdComment)=>{
					if(err){
						res.redirect("back");
					} else {
						createdComment.author.id = req.user._id;
						createdComment.author.username = req.user.username;
						createdComment.save();
						foundCampground.comments.push(createdComment);
						foundCampground.save();
						req.flash("success", "New Comment Created !!");
				res.redirect("/campgrounds/"+req.params.id);
					}
				})
				
				
			}
			
		})
});


//Deleting a comment
router.delete("/:commentId/delete", middleWare.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.commentId, (err,deletedComment)=>{
		if(err){
			console.log(err)
		} else {
			req.flash("success", "Comment Deleted Successfully!!!")
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
});

router.get("/:commentId/edit", middleWare.checkCommentOwnership, (req,res)=>{
   	Campground.findById(req.params.id, (err, foundCampground)=>{
		if(err || !foundCampground){
			req.flash("error","Campground not found !");
			res.redirect("back");
		} else {
			Comment.findById(req.params.commentId, (err, foundComment)=>{
				if(err || !foundComment){
					res.redirect("back");
				} else {
					res.render("updateComment", {comment:foundComment, campground:foundCampground});
				}
			})
			
		}
	})	
		
});

router.put("/:commentId", middleWare.checkCommentOwnership, (req,res)=>{
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment ,(err, updatedComment)=>{
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Comment Updated !")
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});




module.exports = router;