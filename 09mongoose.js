var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/blue',{ useNewUrlParser: true });

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();

app.set("view engine",'pug');
app.set("views","./views");

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

app.use(upload.array());
app.get('/',function(req,res){
	res.render('person');
})

var personSchema = mongoose.Schema({
	name:String,
	age:Number,
	nationality:String
});
var Person = mongoose.model("Person",personSchema);

// 保存
app.post('/person',function(req,res){
	console.log(req.body);
	res.send("succesful"+req.body.name+" "+req.body.age);
	var personInfo = req.body;
	var newPerson = new Person({
		name:personInfo.name,
		age:personInfo.age,
		nationality:personInfo.nationality
	});
	newPerson.save(function(err,Person){
		if(err){
			res.send("error");
		}else{
			res.send("succesful");
		}
	});
});

// 查找
app.get('/find',function(re,res){
	Person.find(function(err,response){
		res.json(response);
	})
});

app.get('/find2',function(req,res){
	Person.find({name:'blue'},function(err,response){
		res.send(response);
	})
})

app.get('/find3',function(req,res){
	Person.find({age:24},'name',function(err,response){
		res.send(response);
	})
})

app.get('/findOne',function(req,res){
	Person.findOne(function(err,response){
		res.send(response);
	})
})

app.get('/findById',function(req,res){
	Person.findById('5b9777d138dc2b4730e3410a',function(err,response){
		res.send(response);
	})
});

// 更新
app.get('/update',function(req,res){
	Person.update({age:23},{name:'hello'},function(err,response){
		res.send(response)
	})
})

app.get('/findOneAndUpdate',function(req,res){
	Person.findOneAndUpdate({age:24},{"nationality":"America"},function(err,response){
		res.send(response);
	});
})

app.get('/findByIdAndUpdate',function(req,res){
	Person.findByIdAndUpdate('5b9777d138dc2b4730e3410a',{name:'hhaha'},function(err,response){
		res.send(response);
	})
})

// 删除
app.get('/remove',function(req,res){
	Person.remove({name:'sky'},function(err,response){
		res.send(response)
	})
})
app.get('/findOneAndRemove',function(req,res){
	Person.findOneAndRemove({age:23},function(err,response){
		res.send(response)
	})
})

app.get('/findByIdAndRemove',function(req,res){
	Person.findByIdAndRemove('5b9781e3e33d471f407152a0',function(err,response){
		res.send(response)
	})
})
app.listen(3000);