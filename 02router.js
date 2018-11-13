var express = require("express");
var app = express();
var things = require("./things.js");

app.use('/things',things);
app.get('/',function(req,res){
	res.send('helloworld');
})
app.listen(3000);