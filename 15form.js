var express = require("express");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blue",{useNewUrlParser:true})

//post request
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//post request


var noteSchema = mongoose.Schema({
	username:String,
	timePublish:String,
	content123:String
}); 

var note = mongoose.model("note",noteSchema);

// app.get("/submitform",(req,res)=>{
// 	console.log(req);
// 	var noteObj = new note({
// 		username:req.query.username,
// 		timePublish:req.query.timePublish,
// 		content:req.query.content123
// 	});
// 	noteObj.save((err,noteObj)=>{
// 		if(err){
// 			console.log(err)
// 		}else{
// 			console.log(noteObj,123);
// 		}
// 		res.send("1234"+noteObj);
// 	})
// })

app.post('/submitform',(req,res)=>{
	res.send("succesful"+req.body);
	var noteObj = new note({
		username:req.body.username,
		timePublish:req.body.timePublish,
		content123:req.body.content123
	});
	noteObj.save((err,noteObj)=>{
		if(err){
			console.log(err);
		}else{
			console.log(noteObj,123);
		}
		res.send("1234"+noteObj)
	});
})
app.listen(3000);