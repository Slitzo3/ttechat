const app = require('express')();
//require the http module
const http = require('http').Server(app);
// require the socket.io module
const io = require('socket.io');
//integrating socketio
socket = io(http);

const Chat = require('../models/Chat');

module.exports = function start(db) {
  socket.on('connection', (socket) => {
    //Someone is typing
    socket.on('typing', (data) => {
      socket.broadcast.emit('notifyTyping', {
        user: data.user,
        message: data.message,
      });
    });

    //when soemone stops typing
    socket.on('stopTyping', () => {
      socket.broadcast.emit('notifyStopTyping');
    });

    socket.on('chat message', function (msg) {
      console.log('message: ' + msg);

      //broadcast message to everyone in port:5000 except yourself.
      socket.broadcast.emit('received', { message: msg });

      //save chat to the database
      db.then((db) => {
        let chatMessage = new Chat({ message: msg, sender: 'Anonymous' });

        chatMessage.save();
      });
    });
  });
};
