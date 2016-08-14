var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var usernames = {};
//console.log(usernames);
io.on('connection', function(socket){
    var currentuser = "";
    io.emit(usernames);
    io.emit("updateUsers", usernames);
    socket.on("addUser", function(data){
        usernames[data.name] = data.color;
        currentuser = data;
        io.emit("announce", data);
        io.emit("updateUsers", usernames); 
        
    });
    
    socket.on("mouseloc", function(data){
        //console.log(data);
        io.emit("displayUsers", data);
    });

    socket.on('disconnect', function(data){
        if(currentuser != ""){
            delete usernames[currentuser.name];
            io.emit("disconnect-users", usernames);
        }
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});