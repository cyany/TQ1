var express = require('express');
var app = express();
app.get('/:id/:name',function(req,res){
	res.send('hello '+req.params.id+"hi "+req.params.name);
});
app.get('/:id([0-9]{5})',function(req,res){
	res.send(req.params.id);
});
app.get('*',function(req,res){
	res.send('404')
})
app.listen(3000);