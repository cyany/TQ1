var express = require("express");
var app = express();
app.get('/hello',function(req,res){
	res.send('hello world');
});
app.post('/hello',function(req,res){
	res.send("post method");
})
app.listen(3000);