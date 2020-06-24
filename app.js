// =============================
// 	Requiring Packages
// =============================
const express 				= require("express");
const app 					= express();
const bodyParser			= require("body-parser");
const mongoose				= require("mongoose");
const Campground			= require("./models/campgroundSchema.js");
const Comment 				= require("./models/commentSchema.js");
const methodOverride		= require("method-override");
const passport				= require("passport");
const localStrategy			= require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession		= require("express-session");
const User 					= require("./models/users.js");
const flash					= require('connect-flash');


// =============================
// 	configuring App
// =============================

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views/assets"));
app.use(expressSession({
	secret: "My Name is Ayush Sood",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// ========================================
// 	Configuring Mongoose and Passport
// ========================================

mongoose.connect("mongodb://localhost:27017/yelpCamp_v2", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
}).then(()=>{
	console.log("Connected to Database");
}).catch((err)=>{
	console.log("err"+err.message);
})

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.specialErrors = req.flash("specialErrors");
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});


// =============================
// 	Requiring Routes
// =============================

const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comment",commentRoutes);
app.use(indexRoutes);



// =============================
// 	Listening to the Port
// =============================

app.listen(5000,()=> {
	console.log("Server started successfully");
});
