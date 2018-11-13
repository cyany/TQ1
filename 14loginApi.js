var express = require("express");
var app = express();
app.get('/login',function(req,res){
	res.json({"username":'abc',"password":'123456'});
});
app.listen(8080);