var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var app = express();
var upload = multer();

app.set('view engine','pug');
app.set('views','./views');

app.use(bodyParser.urlencoded({useNewUrlparser:true}));
app.use(bodyParser.json()); 

app.use(upload.array());
app.use(express.static("public"));

app.get('/',function(req,res){
	console.log(req.body);
	res.render('from')
});
app.post('/hello',function(req,res){
	console.log(req.body);
	res.send("successfully send data");
})
app.listen(3000);
