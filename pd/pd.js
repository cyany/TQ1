var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
mongoose.connect('mongodb://localhost/pd',{ useNewUrlParser: true });
var nodemailer = require("nodemailer");
var request = require("request");
var path = require('path');
var AdmZip = require('adm-zip');
var fs = require('fs');
var officegen = require('officegen');
var async = require('async');
var schedule = require("node-schedule");


var fs = require("fs");
var multer = require("multer");
var upload = multer({dest:"uploads/"});

var cookieParser = require("cookie-parser");
var cookieEncrypter = require('cookie-encrypter');
var secretKey = 'adsadsjadssdaadsdasajdksjadsadsa';
var cookieParams ={
	signed:true,
	maxAge:300000
}
var expressSession = require('express-session');
app.use(cookieParser(secretKey))
app.use(cookieEncrypter(secretKey))
app.use(expressSession({
	secret:'mahdjhasdjhahdsahdshahsdj',
	resave: true, 
	saveUninitialized: true,
	cookie:{maxAge:6000}
}))

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var mongoCon = mongoose.connection;
mongoCon.on('error', console.error.bind(console, 'MongoDB connection error:'));
var pdSchema = mongoose.Schema({
	selected:Number,
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

app.get("/pdLists/cate/:cate",function(req,res){
	pd.find({cate:req.params.cate},function(err,doc){
		var newObj = {};
		newObj.code=200;
		newObj.success="ok";
		newObj.data=doc;
		res.status(200).json(newObj);
	})
})

app.get("/pdLists/color/:color",function(req,res){
	pd.find({color:req.params.color},function(err,doc){
		var newObj = {};
		newObj.code=200;
		newObj.success="ok";
		newObj.data=doc;
		res.status(200).json(newObj);
	})
})

app.get("/pdLists/price",function(req,res){
	var q =pd.find().where('price').gt(req.query.min).lt(req.query.max);
	q.exec(function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json(doc)
		}
	});
})

// app.post("/pdLists/price",function(req,res){
// 	var q =pd.find().where('price').gt(req.body.min).lt(req.body.max);
// 	q.exec(function(err,doc){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.json(doc)
// 		}
// 	});
// })

app.get("/pageNum",function(req,res){
	var currentPage = req.query.currentPage;
	console.log(currentPage)
	pd.find().skip(currentPage*1).limit(1).exec(function(err,doc){
		if(err){
			console.log(err)
		}else{
			res.json(doc);
		}
	})
})

app.post("/upload",upload.array('avatar',2),function(req,res){
	console.log(req.files);
	var imgDist = [];
	req.files.map(function(item){
		imgDist.push(item.filename);
	});
	var pdDetail =new pd({
		selected:req.body.pdselected,
		name:req.body.pdname,
		desc:req.body.pddesc,
		price:req.body.pdprice,
		color:req.body.pdcolor,
		cate:req.body.pdcate,
		img:imgDist.toString()
	});
	console.log(pdDetail)
	pdDetail.save(function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.sendFile(__dirname+"/upload.html");
		}
	})
})

app.get("/setcookie",function(req,res){
	res.cookie('name1','setcookie',cookieParams);
	res.cookie('age1',{mydata:'is encrypted'},cookieParams)
	res.cookie('plaincookie','mytest',cookieParams);
	res.cookie('plaincookie2',{mydata:'is encrypted'},cookieParams)
	res.json({code:0});
})

app.get("/getcookie",function(req,res){
	// var name=req.cookie.name;
	// var age = req.cookie.age;
	// res.json({"name":name,"age":age});
	console.log(req.cookies);
	console.log(req.signedCookies)
	res.json({code:0})
})

app.get("/clearcookie",function(req,res){
	res.clearCookie("age1");
	res.json({code:0});
})

app.get("/setsession",function(req,res){

	console.log(req.session);
	console.log(req.session.cookie)
	if(req.session.pageViews){
		req.session.pageViews++;
			req.session.abc=123;
		res.send("you viewed"+req.session.pageViews)
	}else{
		req.session.pageViews=1;
		res.send("one time")
	}
})

var pdorderlistSchema = mongoose.Schema({
	allPrice:Number,
	username:String,
	status:Number
});
var pdorderinfoSchema = mongoose.Schema({
	prodcutid:String,
	num:Number,
	orderNum:String
});
var userSchema = mongoose.Schema({
	name:String,
	gender:String,
	age:Number,
	email:String
});
var pdorderlist = mongoose.model('orderlist',pdorderlistSchema);
var pdorderinfo = mongoose.model('orderitems',pdorderinfoSchema);
var pduser = mongoose.model('user',userSchema);

app.get("/addtocart",function(req,res){
	// params:id,num
	pd.findById('5bef68cffe4f5f216c6ce81f',function(err,doc){
		if(err){
			console.log(err)
		}else{
			var pdorderinfoDetail = new pdorderinfo({
				prodcutid:'5bef68cffe4f5f216c6ce81f',
				num:2,
				orderNum:doc2._id
			});
			pdorderinfoDetail.save(function(err,doc){
				if(err){console.log(err)}else{
					res.json({code:0});
				}
			})
			
		}
	});
	
	
	// 
})

app.get("/cart",function(req,res){
	// name
	pduser.find({name:'jack'},function(err,doc){
		if(err){
			console.log(err)
		}else{
			res.json(doc)
		}
	})
})
app.get("/generateOrder",function(req,res){
	var pdorderDetail = new pdorderlist({
		allPrice:0,
		username:'jack4',
		status:1,
	});
	console.log(pdorderDetail)
	pdorderDetail.save(function(err,doc2){
		if(err){
			console.log(err)
		}else{
			res.json(doc);
		}

	})
})

app.get("/sendEmail",function(req,res){
	nodemailer.createTestAccount((err, account) => {
	    // create reusable transporter object using the default SMTP transport
	    let transporter = nodemailer.createTransport({
	            host: "smtp.163.com",
	            secureConnection: true,
	            port:465,
	        auth: {
	            user: 'xxx@163.com', // generated ethereal user
	            pass: 'xxx' // generated ethereal password
	        }
	    });

	    // setup email data with unicode symbols
	    let mailOptions = {
	        from: 'xxx@163.com', // sender address
	        to: 'xxx@qq.com', // list of receivers
	        subject: 'Hello ✔', // Subject line
	        text: 'Hello world?', // plain text body
	        html: `<div>
	        <h2 style="font-size:30px;color:#53ff53;">haha</h2>
	        <a href="http://www.cyany.com">1345648</a>`, // html body
	        attachments:[
	        	{
	        		filename:'text.txt',
	        		content:'hello,world'
	        	},
	        	{
	        		filename:'text.txt',
	        		path:'text.txt'
	        	}
	        ]
	    };

	    transporter.verify(function(error, success) {
	   if (error) {
	        console.log(error);
	   } else {
	        console.log('Server is ready to take our messages');
	   }
	});
	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            return console.log(error);
	        }
	        console.log('Message sent: %s', info.messageId);
	        // Preview only available when sending through an Ethereal account
	        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

	        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	    });
	});
	res.json({code:0})
})

// request('https://jsonplaceholder.typicode.com/todos/1',{json:true},(err,res,body)=>{
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(res)
// 		console.log(body,123);
// 	}
// })

let formData ={
	post:'123',
	abc:'456'
};

let content;
request.post({url:'https://jsonplaceholder.typicode.com/posts',formData:formData},(err,res,body)=>{
	if(err){
		console.log(err);
	}else{
		content = body;
		console.log(body,123);
	}
});
app.get('/otherApi',function(req,res){
	console.log(content,456);
	if(content){
		res.json(JSON.parse(content));
	}else{
		res.json({code:1,'msg':'error !'})
	}
});

// var zip = new AdmZip();
// app.get('/generateZip',function(req,res){
// 	var content = "inner content of the file";
// 	zip.addFile('zipdemo.txt',Buffer.alloc(content.length,content),"comment");
// 	zip.addLocalFile("F:/express/pd/uploads/0e7c7ba77f991465157d14c1c0d0322b");
// 	// var willSendthis = zip.toBuffer();
// 	// console.log(willSendthis);  buffer stream data
// 	zip.writeZip('F:/express/pd/uploads/zip2.zip'); absolute path !!!
// 	res.json({code:1});
// });

app.get("/extractZip",function(req,res){
	var zip = new AdmZip("F:/express/pd/uploads/zip1.zip");
	var zipEntries = zip.getEntries();
	zipEntries.forEach(function(zipEntry){
		console.log(zipEntry.toString(),123);
		if(zipEntry.entryName =="zipdemo.txt"){
			console.log(zipEntry.getData().toString('utf8'),456);
		}
	});
	console.log(zip.readAsText("F:/express/pd/text.txt"),789);
	// zip.extractEntryTo("F:/express/pd/zip1.zip","F:/express/pd/uploads/",false,true);
	zip.extractAllTo("F:/express/pd/uploads/",true);
});

app.get("/generateExcle",function(req,res){
	var content = [{
	    "name": "Nilesh",
	    "school": "RDTC",
	    "marks": "77"
	   },{
	    "name": "Sagar",
	    "school": "RC",
	    "marks": "99.99"
	   },{
	    "name": "Prashant",
	    "school": "Solapur",
	    "marks": "100"
	 }];
	 var data = '';
	 for(var i = 0;i < content.length;i++){
	 	data+=content[i].name+'\t'+content[i].school+'\t'+content[i].marks+'\n';
	 }
	 fs.appendFile(path.join(__dirname,'/uploads/score1.xls'),data,(err)=>{//or:F:/express/pd/uploads/score.xls
	 	if(err){
	 		console.log(err);
	 	}else{
	 		res.json({code:0,meg:'successfully created xls.'});
	 	}
	 });
})

app.get("/generateWord",function(req,res){
	var docx = officegen ( 'docx' );  //create docx
	var pObj = docx.createP(); //create paragrph
	pObj.options.align="center";  //set center
	pObj.addText("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit ipsum molestiae assumenda sint cum voluptas impedit dolorem praesentium enim fuga.\r\n");
	pObj.addLineBreak ();//line break
	pObj.addText('with color',{color:'53ff53'});
	pObj.addLineBreak ();
	pObj.addText('External link',{link:'https:google.com'});//add linked text
	pObj.startBookmark("myBookmask"); //not work
	pObj.endBookmark('myBookmask');
	//create table
	var table = [
	  [{
	    val: "No.",
	    opts: {
	      cellColWidth: 4261,
	      b:true,
	      sz: '48',
	      shd: {
	        fill: "7F7F7F",
	        themeFill: "text1",
	        "themeFillTint": "80"
	      },
	      fontFamily: "Avenir Book"
	    }
	  },{
	    val: "Title1",
	    opts: {
	      b:true,
	      color: "A00000",
	      align: "right",
	      shd: {
	        fill: "92CDDC",
	        themeFill: "text1",
	        "themeFillTint": "80"
	      }
	    }
	  },{
	    val: "Title2",
	    opts: {
	      align: "center",
	      vAlign: "center",
	      cellColWidth: 42,
	      b:true,
	      sz: '48',
	      shd: {
	        fill: "92CDDC",
	        themeFill: "text1",
	        "themeFillTint": "80"
	      }
	    }
	  }],
	  [1,'All grown-ups were once children',''],
	  [2,'there is no harm in putting off a piece of work until another day.',''],
	  [3,'But when it is a matter of baobabs, that always means a catastrophe.',''],
	  [4,'watch out for the baobabs!','END'],
	]
	var tableStyle = {
	  tableColWidth: 4261,
	  tableSize: 24,
	  tableColor: "ada",
	  tableAlign: "left",
	  tableFontFamily: "Comic Sans MS",
	  borders: true
	}
	docx.createTable (table, tableStyle);
	var out = fs.createWriteStream(path.join(__dirname,'/uploads/demo.docx'));
	out.on('error',function(err){
		console.log(err);
	});
	async.parallel([
			function(done){
				out.on('close',function(){
					console.log('created');
					done(null);
				});
				docx.generate(out);
			}
		],function(err){
			if(err){
				console.log(err,2);
			}
		})
})

var j = schedule.scheduleJob('49 * * * *',function(){
	console.log("every hour 's 49 minutes.")
});
var j1 = schedule.scheduleJob(new Date(2018,10,27,15,52,0),function(){
	console.log("2018/10/27 15:52:00 running")
});
var rule =new schedule.RecurrenceRule();
rule.minute = 2;
var j2 = schedule.scheduleJob(rule,function(){
	console.log("every minute 's 2 running again!")
})
var j3 = schedule.scheduleJob({hour:16,minute:12,dayOfWeek:2},function(){
	console.log("every thuesday 16:12:00 running !");
});
// j3.cancel();  invalidate j3 job.


app.all("*",function(req,res){
	res.json({code:404,info:"该页面不存在"})
})


app.listen(3000);