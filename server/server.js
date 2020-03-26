const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var xss = require("xss");

const {Rooms} = require('./utils/rooms');
const {User} = require('./utils/user');
const {generateMessage, generateAlert} = require('./utils/message');
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
    params.name = xss(params.name);
    params.room = xss(params.room);

    // Validate data
    if (!isRealString(params.name)) {
      callback('Invalid name');
    } else if (params.name.length > 20) {
      callback('Name is too long (max: 20 characters)');
    } else {
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

      // Send user info
      var id = socket.id;
      var username = params.name;
      io.to(socket.id).emit('userInfo', {id, username} );

      // Send room info
      // io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));

      socket.emit('newAlert', generateAlert(`Welcome to the chat app, ${params.name}`));
      if (rooms.getUsers(room.id).length > 1) {
        socket.broadcast.to(room.id).emit('newAlert', generateAlert(`${params.name} joined the chat`));
      } else {
        socket.emit('newAlert', generateAlert('Please wait for someone to join'));
      }

      callback();
    }
  });

  socket.on('requestUserList', (userID) => {
    // Send room info
    userID = xss(userID);

    var room = rooms.getRoomOfUser(userID);
    io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));
  });

  socket.on('sendStatus', (params) => {
    try {
      // Send latest status
      params.fromID = xss(params.fromID);
      params.text = xss(params.text);

      var room = rooms.getRoomOfUser(params.fromID);
      socket.broadcast.to(room.id).emit('newStatus', params.text); 
    } catch(e) {
      console.log('sendStatus ERROR: ' + e);
    }
  });

  socket.on('createMessage', (message, callback) => {
    try {
      message.from = xss(message.from);
      message.fromID = xss(message.fromID);
      message.text = xss(message.text);

      var room = rooms.getRoomOfUser(message.fromID);
      if (room && isRealString(message.text)) {
        io.to(room.id).emit('newMessage', generateMessage(message.from, message.fromID, message.text));
      }
      
      callback(); 
    } catch(e) {
      console.log('createMessage ERROR: ' + e);
    }
  });

  socket.on('disconnect', () => {
    var user = rooms.getUser(socket.id);
    if (!user) return;

    var room = rooms.getRoomOfUser(socket.id);
    rooms.removeUser(socket.id);

    if (rooms.getUsers(room.id).length > 0) {
      // Send room info
      io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));
    
      // Send user left info
      var username = user.name;
      io.to(room.id).emit('userLeft', username);

      // Send status info
      io.to(room.id).emit('newStatus', 'Offline'); 
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  
  setInterval(() => {
    // Delete empty rooms
    if (rooms.rooms && rooms.rooms.length > 0) {
      rooms.clean();
    }

    // Emit number of users
    io.emit('responseUserAmount', rooms.numberOfUsers());
  }, 1000);
});