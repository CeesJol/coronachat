var socket = io();

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'cees',
        text: 'it works'
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected to server');
});

socket.on('newMessage', function (message) {
    console.log(message);
});