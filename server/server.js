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
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    // Validate data
    if (!isRealString(params.name)) {
      callback('Invalid name');
    }

    // Find best room
    var room = rooms.findBestRoom();

    // Create user
    var me = new User(socket.id, room.id);

    // Add user to a room
    rooms.addUser(room.id, me);

    // Join user to a room
    socket.join(room.id);

    // Join user to itself
    socket.join(socket.id);

    console.log(socket.id + ' joined room: ' + room.id);

    // Send player info
    var id = socket.id;
    var username = params.name;
    io.to(socket.id).emit('playerInfo', {id, username} );

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(room.id).emit('newMessage', generateMessage('Admin', `${params.name} user joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    var room = rooms.getRoomOfUser(message.fromID);
    io.to(room.id).emit('newMessage', generateMessage(message.from, message.text));
    callback(); 
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log('\n');
  console.log('-----------------------');
  console.log(`Server is up on ${port}`);
});
