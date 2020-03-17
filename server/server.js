const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Rooms} = require('./utils/rooms');
const {User} = require('./utils/user');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var rooms = new Rooms();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    // Validate data
    if (!isRealString(params.name)) {
      callback('Invalid name');
    }

    // Find best room
    var room = rooms.findBestRoom();

    // Create user
    var me = new User(socket.id, params.name, room.id);

    // Add user to a room
    rooms.addUser(room.id, me);

    // Join user to a room
    socket.join(room.id);

    // Join user to itself
    socket.join(socket.id);

    console.log(params.name + ' joined room: ' + room.id);

    // Send room info
    io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));

    // Send player info
    var id = socket.id;
    var username = params.name;
    io.to(socket.id).emit('playerInfo', {id, username} );

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    if (rooms.getUsers(room.id).length > 1) {
      socket.broadcast.to(room.id).emit('newMessage', generateMessage('Admin', `${params.name} user joined`));
    } else {
      socket.emit('newMessage', generateMessage('Admin', 'Please wait for someone to join'));
    }

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    try{
      console.log("'" + message.from + ": " + message.text + "'");
      var room = rooms.getRoomOfUser(message.fromID);

      if (room && isRealString(message.text)) {
        io.to(room.id).emit('newMessage', generateMessage(message.from, message.text));
      }
      
      callback(); 
    } catch(e) {
      console.log('createMessage ERROR: ' + e);
    }
  });

  socket.on('disconnect', () => {
    var user = rooms.getUser(socket.id);
    var room = rooms.getRoomOfUser(socket.id);

    rooms.removeUser(socket.id);

    console.log(`User ${user.name} disconnected`);

    if (rooms.getUsers(room.id).length > 0) {
      // Send room info
      io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));
    
      io.to(room.id).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat.`));
    }
  });
});

server.listen(port, () => {
  console.log('\n');
  console.log('-----------------------');
  console.log(`Server is up on port ${port}`);
});
