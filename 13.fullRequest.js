var express = require("express");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blue",{useNewUrlParser:true});

var personSchema = mongoose.Schema({
	name:'string',
	age:'number',
	nationiality:'string'
});

var Person = mongoose.model("Person",personSchema);
	
app.get("/",function(req,res){
	// var p = new Person({
	// 	name:"123",
	// 	age:25,
	// 	nationiality:'Japan'
	// });
	// p.save(function(err,Person){
	// 	if(err){
	// 		res.send("error");
	// 	}else{
	// 		res.send("succesful");
	// 	}
	// });
	// res.end("end");
	Person.find((err,response)=>{
		// res.status(200).send({"code":200});
		res.json(response);
		res.end("The end");
	});
	// res.json({"data":{"name":123, "age":24, "gender":"man"},"code":200,"msg":'success'});
})
app.listen(3000);