var express = require("express");
var app = express();

var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get('/',function(req,res){
	res.cookie('name',"express");
	res.cookie('age',20,{expire:360000+Date.now()});
	res.cookie('nationality',"chinese",{maxAge:360000});
	res.send("cookie seted")
});
app.get('/clear',function(req,res){
	res.clearCookie('name');
	res.send('clear done')
})

app.listen(3000)