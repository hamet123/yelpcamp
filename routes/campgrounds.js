const express    = require("express");
const router     = express.Router({mergeParams:true});
const Campground = require("../models/campgroundSchema");
const middleWare = require("../middleware/index.js");
const Comment    = require("../models/commentSchema")

// Getting all Campgrounds
router.get("/",(req,res)=>{
	
	Campground.find({},(err, campgrounds)=>{
		if(err){
			console.log("OOPS! We have an error !")
		} else {
			res.render("index",{campgrounds:campgrounds});
		}
	});
	
});

// Form for creating a new campground
router.get("/new", middleWare.isLoggedIn,(req,res)=>{
	res.render("addCamp");
});

// Handling request for creating a new campground
router.post("/",middleWare.isLoggedIn, (req,res)=>{
	const name = req.body.name;
	const image= req.body.image;
	const description = req.body.description;
	const price = req.body.price;
	
	Campground.create({name:name, image:image, description:description, price:price, author: { id: req.user._id, username:req.user.username}},(err)=>{
		if(err){
			console.log("OOPS!! An Error Occured" + err);
		} else {
			res.redirect("/campgrounds");
		}
	})
});

// Showing a campground with its id on show Page
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err || !foundCampground){
			req.flash("error", "Campground Not Found !!")
			res.redirect("/campgrounds");
		} else {
			res.render("newShow", {campground:foundCampground});
		}
	})
	
});

router.get("/:id/edit", middleWare.checkCampgroundOwnership, (req,res)=>{
	Campground.findById(req.params.id, (err,foundCampground)=>{
		if(err){
			console.log(err);
		} else {
			res.render("updateCampground",{campground:foundCampground});
		}
	})
	
});

router.put("/:id", middleWare.checkCampgroundOwnership, (req,res)=>{
	   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, foundCampground)=>{
		   if(err){
			   console.log(err);
			} else {
				req.flash("success","Campground updated !")
				res.redirect("/campgrounds/"+req.params.id);
			}
		   
	   })
});

router.delete("/:id", middleWare.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndDelete(req.params.id, (err,deletedCampground)=>{
		if(err){
			console.log(err);
		} else {
			Comment.deleteMany( {_id: { $in: deletedCampground.comments } }, (err) => {
            if (err){
				console.log(err);
			} else {
				res.redirect("/campgrounds");
			}
			
			})
		}
	})
});
		



module.exports = router;