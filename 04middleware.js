var express = require('express');
var app = express();
app.use(function(req,res,next){
	console.log('request send'+Date.now());
	next();
})
app.get('/',function(req,res,next){
	res.send("132456789");
	next();
})
app.use('/',function(req,res){
	console.log(Date.now())
})
app.listen(3000);