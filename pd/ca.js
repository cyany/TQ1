var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require('socket.io')(http);

app.get('/c',function(req,res){
	res.sendFile(__dirname+"\\socket.html");
	// res.json({code:__dirname+"\\socket.html"})
})
// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect',function(){
//   	console.log('user disconnect');
//   });
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000,function(){
	console.log("The server is running on port 3000!")
});