const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Rooms} = require('./utils/rooms');
const {User} = require('./utils/user');
const {generateMessage, generateAlert} = require('./utils/message');
const {isRealString, sanitize} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var rooms = new Rooms();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    params.name = sanitize(params.name);

    // Validate data
    if (!isRealString(params.name)) {
      callback('Invalid name');
    } else if (params.name.length > 20) {
      callback('Name is too long (max: 20 characters)');
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

    // Send player info
    var id = socket.id;
    var username = params.name;
    io.to(socket.id).emit('userInfo', {id, username} );

    // Send room info
    // io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));

    socket.emit('newAlert', generateAlert(`Welcome to the chat app, ${params.name}`));
    // if (rooms.getUsers(room.id).length > 1) {
    //   socket.broadcast.to(room.id).emit('newAlert', generateAlert(`${params.name} joined the chat`));
    // } else {
    //   socket.emit('newAlert', generateAlert('Please wait for someone to join'));
    // }

    callback();
  });

  socket.on('requestUserList', (userID) => {
    // Send room info
    userID = sanitize(userID);

    var room = rooms.getRoomOfUser(userID);
    io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));
  });

  socket.on('sendStatus', (params, callback) => {
    try {
      // Send latest status
      params.fromID = sanitize(params.fromID);
      params.text = sanitize(params.text);

      var room = rooms.getRoomOfUser(params.fromID);
      var user = rooms.getUser(params.fromID);
      socket.broadcast.to(room.id).emit('newStatus', params.text); 

      callback();
    } catch(e) {
      console.log('createMessage ERROR: ' + e);
    }
  });

  socket.on('createMessage', (message, callback) => {
    try {
      message.from = sanitize(message.from);
      message.fromID = sanitize(message.fromID);
      message.text = sanitize(message.text);

      console.log("'" + message.from + ": " + message.text + "'");
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
    var room = rooms.getRoomOfUser(socket.id);

    rooms.removeUser(socket.id);

    console.log(`User ${user.name} disconnected`);

    if (rooms.getUsers(room.id).length > 0) {
      // Send room info
      io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));
    
      var username = user.name;
      io.to(room.id).emit('userLeft', username);
    }
  });
});

server.listen(port, () => {
  console.log();
  console.log('-----------------------');
  console.log(`Server is up on port ${port}`);

  // Delete empty rooms
  setInterval(() => {
    if (rooms.rooms && rooms.rooms.length > 0) {
      rooms.clean();
    }
  }, 1000);
});