var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(function(req,res){
	res.setHeader('Content-Type','text/plain');
	res.write("demo test bodyParser:\n");
	res.end(JSON.stringify(req.body,null,2))
})

app.use(cookieParser());
app.get('/',function(req,res){
	console.log(req.cookies);
})
app.listen(3000);