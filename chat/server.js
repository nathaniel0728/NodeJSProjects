var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


/*
var usernames = [];

io.on('connection', function(socket){
    io.emit('joined', "User");
    io.emit('online', usernames);
  socket.on('chat', function(msg){
    io.emit('chat', msg);
  });
  socket.on('disconnect', function(msg){
      io.emit('left', "User");
      io.emit('online', usernames);
  });
  socket.on("save-user", function(user){
      usernames.push(user);
      io.emit('online', usernames);
  });
});

*/

var usernames = [];
//console.log(usernames);
io.on('connection', function(socket){
    var currentuser = "";
    io.emit('user-update', usernames); 
    socket.on('save-user', function(data){
        usernames.push(data);
        currentuser = data;
        io.emit('user-update', usernames);
        io.emit('announce', currentuser);
    });
    socket.on('disconnect', function(data){
        if(currentuser != ""){
           var index = usernames.indexOf(currentuser);
            usernames.splice(index, 1);
            io.emit('user-update', usernames);
            io.emit('denounce', currentuser); 
        }
    });
    socket.on('chat', function(data){
        io.emit('chat', data); 
    });

});





http.listen(3000, function(){
  console.log('listening on *:3000');
});