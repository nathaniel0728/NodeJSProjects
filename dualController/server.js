var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/desktop.html');
});
app.get('/mobile', function(req, res){
    res.sendFile(__dirname + '/views/mobile.html');
});

var regUsers = {};
console.log(regUsers);
io.on("connection", function(socket){
    var deskSocket;
    var mobileSocket;
    
    socket.on("desktop-register", function(data){
        regUsers[data.id] = deskSocket = socket; 
        console.log(data.id);
    });
    socket.on("mobile-register", function(data){
        mobileSocket = socket;
        if(typeof(regUsers[data.id]) !== "undefined") {
            console.log(data.id);
            deskSocket = regUsers[data.id];
            
            deskSocket.emit('mobile-on');
            mobileSocket.emit('start');
        }
    });
    socket.on("display", function(data){
        deskSocket.emit("display", data);
        console.log(data);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});