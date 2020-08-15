var express = require('express');
var app=express();
var server=require('http').Server(app)
var io=require('socket.io')(server);




app.set('views','./views')
app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
var rooms={ }
var users;
app.get('/',(req,res)=>{
    res.render('roomhoster',{rooms:rooms})
})
app.post('/room',(req,res)=>{
    if(rooms[req.body.room] != null){
        return res.redirect('/')
    }
    rooms[req.body.room]= { users: {} }
    console.log(users)
    res.redirect(req.body.room)
    io.emit('room-created', req.body.room)
})
app.get('/:room',(req,res)=>{
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
      }
    res.render('room',{roomName:req.params.room})
})
console.log(rooms)
server.listen(7000)

io.on('connection',function(socket){
    
    socket.on('new-user',function(room,data){
        socket.join(room)
        
        rooms[room].users[socket.id]=data
        socket.to(room).broadcast.emit('newconnect',data)
    })
    socket.on('chat',function(room,data){
        io.sockets.to(room).emit('chat',data);
    })

    socket.on('typing',function(room,data){
        socket.to(room).broadcast.emit('typing',data)
    })

    socket.on('streambroadcast',function(room,streamdata){
        
        socket.to(room).broadcast.emit('streambroadcast',streamdata)
    })
    
    socket.on('disconnect',function(){
        getUserRooms(socket).forEach(room => {
            socket.to(room).broadcast.emit('userdisconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
    })
})
    
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [data, room]) => {
      if (room.users[socket.id] != null) names.push(data)
      return names
    }, [])
  }

