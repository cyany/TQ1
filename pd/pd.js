var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
mongoose.connect('mongodb://localhost/pd',{ useNewUrlParser: true });

var fs = require("fs");
var multer = require("multer");
var upload = multer({dest:"uploads/"});

var cookieParser = require("cookie-parser");
var cookieEncrypter = require('cookie-encrypter');
var secretKey = 'adsadsjadssdaadsdasajdksjadsadsa';
var cookieParams ={
	signed:true,
	maxAge:300000
}
var expressSession = require('express-session');
app.use(cookieParser(secretKey))
app.use(cookieEncrypter(secretKey))
app.use(expressSession({
	secret:'mahdjhasdjhahdsahdshahsdj',
	resave: true, 
	saveUninitialized: true,
	cookie:{maxAge:6000}
}))

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var mongoCon = mongoose.connection;
mongoCon.on('error', console.error.bind(console, 'MongoDB connection error:'));
var pdSchema = mongoose.Schema({
	selected:String,
	name:String,
	price:Number,
	desc:String,
	img:String,
	color:String,
	cate:String
});

var pd = mongoose.model('pdLists',pdSchema);
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.get("/",function(req,res){
	res.send("123");
});

app.get("/pdLists",function(req,res){
	pd.find(function(err,doc){
		if(err){
			console.log(err)
		}else{
			res.status(200).json(doc);			
		}
	})
})

app.get("/pdLists/cate/:cate",function(req,res){
	pd.find({cate:req.params.cate},function(err,doc){
		var newObj = {};
		newObj.code=200;
		newObj.success="ok";
		newObj.data=doc;
		res.status(200).json(newObj);
	})
})

app.get("/pdLists/color/:color",function(req,res){
	pd.find({color:req.params.color},function(err,doc){
		var newObj = {};
		newObj.code=200;
		newObj.success="ok";
		newObj.data=doc;
		res.status(200).json(newObj);
	})
})

app.get("/pdLists/price",function(req,res){
	var q =pd.find().where('price').gt(req.query.min).lt(req.query.max);
	q.exec(function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json(doc)
		}
	});
})

// app.post("/pdLists/price",function(req,res){
// 	var q =pd.find().where('price').gt(req.body.min).lt(req.body.max);
// 	q.exec(function(err,doc){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.json(doc)
// 		}
// 	});
// })
app.post("/upload",upload.array('avatar',2),function(req,res){
	console.log(req.files);
	var imgDist = [];
	req.files.map(function(item){
		imgDist.push(item.filename);
	});
	var pdDetail =new pd({
		selected:req.body.pdselected,
		name:req.body.pdname,
		desc:req.body.pddesc,
		price:req.body.pdprice,
		color:req.body.pdcolor,
		cate:req.body.pdcate,
		img:imgDist.toString()
	});
	console.log(pdDetail)
	pdDetail.save(function(err,doc){
		if(err){
			console.log(err);
		}else{
			// res.json({"code":0,"data":doc});
			res.sendFile(__dirname+"/upload.html");
		}
	})
})

app.get("/setcookie",function(req,res){
	res.cookie('name1','setcookie',cookieParams);
	res.cookie('age1',{mydata:'is encrypted'},cookieParams)
	res.cookie('plaincookie','mytest',cookieParams);
	res.cookie('plaincookie2',{mydata:'is encrypted'},cookieParams)
	res.json({code:0});
})

app.get("/getcookie",function(req,res){
	// var name=req.cookie.name;
	// var age = req.cookie.age;
	// res.json({"name":name,"age":age});
	console.log(req.cookies);
	console.log(req.signedCookies)
	res.json({code:0})
})

app.get("/clearcookie",function(req,res){
	res.clearCookie("age1");
	res.json({code:0});
})

app.get("/setsession",function(req,res){

	console.log(req.session);
	console.log(req.session.cookie)
	if(req.session.pageViews){
		req.session.pageViews++;
			req.session.abc=123;
		res.send("you viewed"+req.session.pageViews)
	}else{
		req.session.pageViews=1;
		res.send("one time")
	}
})
app.all("*",function(req,res){
	res.json({code:404,info:"该页面不存在"})
})

app.listen(3000);