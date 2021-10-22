const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./UserSchema');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json({limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

const users = {};

const CONNECTION_URL = 'mongodb+srv://timhsu:7xvPjvAEI3jMuhhf@users.xnee2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;
const MONGOOSE_PORT = 5001

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  if(!users[socket.id]){
    users[socket.id] = [socket.id, " has entered the server"];
    io.sockets.emit('entered', users);
    socket.on('go somewhere', function(users) {
      io.sockets.emit('go somewhere', users);
    })

    mongoose.connect(CONNECTION_URL, { useNewUrlparser: true, useUnifiedTopology: true })

    let newUser = new User({ name: socket.id, location: "Place" })
    newUser.save()
    // .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    // .catch((error) => console.log(error.message))
  }
});


server.listen(PORT, () => {
  console.log('listening on PORT:5000');
});