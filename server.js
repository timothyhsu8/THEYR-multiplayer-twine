const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// app.get('/group/:groupId', (req, res) => {
//   res.send("Welcome Group " + req.params.groupId + "!")
// })

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})