var express = require("express");
var app = express();
app.set('view engine','pug');
app.set('views','./views');

// app.get('/',function(req,res){
// 	res.render('first_view');
// });

app.get('/',function(req,res){
	res.render('first_view',{
		name:'demo !',
		url :'google.com',
		text:'hahhahhahh',
		user:{name:'bluesky',age:20}
	})
});
app.listen(3000);