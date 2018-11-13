var express = require("express");
var app = express();
app.set('view engine','pug');
app.set('views','./views');
app.use(express.static('public'));
app.use('/static',express.static('public'));
app.get('/',function(req,res){
	res.render('first_view');
})
app.listen(3000);