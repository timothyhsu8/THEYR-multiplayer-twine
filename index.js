const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  if(!users[socket.id]){
    users[socket.id] = [socket.id, " has entered the server"];
    socket.emit('entered', users);
  }
});

io.on('go somewhere', (data) =>{
  socket.emit('go somewhere', data);
})

server.listen(3000, () => {
  console.log('listening on PORT:3000');
});