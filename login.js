var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret:'this is a secret'}));

let User = [];
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.post("/signup",function(req,res){
	res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
	 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	 // Set custom headers for CORS
	 res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

	if(req.body.usrename =="" || req.body.password ==""){
		res.send("The account is empty now !")
	}else{
		User.filter(function(item){
			if(item.username == req.body.username){
				res.send("the account is already exist !")
			}
		})
		var newUser = {};
		newUser.username = req.body.username;
		newUser.password = req.body.password;
		User.push(newUser);
		req.session.user = newUser;
		console.log(newUser,123);
		res.status(200).json({"data":"ok","code":0})
		
	}
})
app.post("/login",function(req,res,next){
	if(req.body.username == "" || req.body.password ==""){
		res.send("please input your username or password");
	}else{
		console.log(User);
		User.filter(function(user){
			if(user.username === req.body.username && user.password ===req.body.password){
				req.session.user = user;
				res.status(200).end("login successfully");
			}
		})
	}
	next();
})

app.get("/logout",function(req,res,){
	res.session.destory(function(){
		res.send("delete session !")
	});
})
app.listen(3000);