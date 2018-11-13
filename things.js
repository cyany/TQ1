var express = require("express");
var router = express.Router();
router.get('/',function(req,res){
	res.send('router get');
});
router.all('/hello',function(req,res){
	res.send('router get123456');
});
module.exports = router;