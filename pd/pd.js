var express = require('express');
var app = express();
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/pd',{ useNewUrlParser: true });

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
















app.listen(3000);