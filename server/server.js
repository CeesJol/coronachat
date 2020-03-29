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
      var room;
      if (params.room) {
        room = rooms.getRoom(params.room);
      } else {
        // If user specified no room, find best room
        room = rooms.findBestRoom();
      }

      if (!room) {
        callback('That room does not exist (anymore).');
      } else {
        // Create user
        var me = new User(socket.id, params.name, room.id);

        // Add user to a room
        if (!rooms.addUser(room.id, me)) {
          callback('That room is full...');
          return false;
        }

        // Join user to a room
        socket.join(room.id);

        // Join user to itself
        socket.join(socket.id);

        // Send user info
        var id = socket.id;
        var username = params.name;
        var roomName = room.name;
        var roomMaxSize = room.maxSize;
        io.to(socket.id).emit('userInfo', {id, username, roomName, roomMaxSize} );

        // Send room info
        // Necessary?
        io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));

        socket.emit('newAlert', generateAlert(`Welcome to the chat app, ${params.name}`));
        if (rooms.getUsers(room.id).length > 1) {
          socket.broadcast.to(room.id).emit('newAlert', generateAlert(`${params.name} joined the chat`));
        } else {
          socket.emit('newAlert', generateAlert('Please wait for someone to join'));
        }

        callback();
      }
    }
  });

  socket.on('requestUserList', (userID) => {
    // Send room info
    userID = xss(userID);

    var room = rooms.getRoomOfUser(userID);
    io.to(room.id).emit('updateUserList', rooms.getUsers(room.id));
  });

  socket.on('requestRoomInfo', () => {
    io.to(socket.id).emit('responseRoomInfo', rooms.rooms);
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

  socket.on('requestAdmin', (data, callback) => {
    var user = rooms.getUser(socket.id);
    if (!user) {
      callback('You don\'t seem to exist on our server.');
      return;
    } else if (user.admin) {
      callback('You are already admin');
      return;
    }

    console.log('Admin request:');
    console.log(data.password);

    if (data.password == '123') {
      callback();
      user.admin = true;
    } else {
      callback('Password is incorrect');
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
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  
  setInterval(() => {
    if (rooms.rooms) {
      // Delete or create rooms
      rooms.clean();

      // Emit sorted rooms
      rooms.sort();
      io.emit('responseRoomInfo', rooms.rooms);

      // Emit number of users
      io.emit('responseUserAmount', numberOfUsers());
    }
  }, 1000);
});

function numberOfUsers() {
  return io.engine.clientsCount;
}