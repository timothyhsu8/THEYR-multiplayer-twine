const express = require('express');
const app = express();
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const User = require('./server/UserSchema');

const router = require('./server/router.js')
app.use('/api', router)

app.use("/static", express.static('./static/'));

const PORT = process.env.PORT || 5000
const CONNECTION_URL = 'mongodb+srv://timhsu:7xvPjvAEI3jMuhhf@users.xnee2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/socket_game.html');
})

app.get('/redux', (req, res) => {
  res.sendFile(__dirname + '/redux.html');
})

io.on('connection', (socket) => {

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  
  mongoose.connect(CONNECTION_URL, { useNewUrlparser: true, useUnifiedTopology: true })

  let newUser = new User({ 
    name: "Meekaser", 
    location: "New Location"
  })

  newUser.save()
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})