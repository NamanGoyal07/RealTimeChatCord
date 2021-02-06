const path = require('path');
const express = require('express');
const app = express();
const http =  require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

app.use(express.static(path.join(__dirname,'public')));
const server = http.createServer(app);
const io = socketio(server);
const botName = "ChatCord Bot"

// Run when some client connects
io.on('connection', function(socket){

    socket.on('joinroom',({username,room})=>{
        const user = userJoin(socket.id,username,room);
        // Create a user
        socket.join(user.room);
        socket.emit('message',formatMessage(botName,'Welcome to ChatCord'));

        // BroadCast when a user connects
        socket.broadcast.to(user.room).emit('messageb',formatMessage(botName,` ${user.username} has joined the Chat`));

        // Send users and room info

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    console.log("New WS Conncetion with id = " +socket.id);

    // Listen for the chatMessage
    socket.on('chatMessage',function(message){
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,message));
    });

    // Run when client disconnects
    socket.on('disconnect',function(){
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('messaged',formatMessage(botName,`${user.username} has left the Chat`));
            
            // Send users and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }
    });

});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});


