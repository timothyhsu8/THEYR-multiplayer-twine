const express = require('express');
const http = require('http');
const Redux = require('redux');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./server/UserSchema');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json({limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

const router = require('./server/router.js')
app.use('/api', router)

app.use("/static", express.static('./static/'));
app.use("/reduxxer", express.static('./reduxxer/'));
const CONNECTION_URL = 'mongodb+srv://timhsu:7xvPjvAEI3jMuhhf@users.xnee2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;

const users = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/socket_game.html');
})

app.get('/ruby', (req, res) => {
  res.sendFile(__dirname + '/Ruby.html');
})

io.on('connection', (socket) => {
  socket.on('difference', (state) => {
    socket.broadcast.emit('difference', state)
    store.dispatch({type: 'UPDATE', payload: state});
  })
  socket.on('connect', (state) => {
    socket.emit('connect', state)
  })
})

var store = Redux.createStore(reducer);

function reducer(state, action){
  switch(action.type){
    case 'UPDATE':
      console.log({...state, ...action.payload});
      socket.emit('difference', {...state, ...action.payload}) //causes error state not iterable
      return {...state, ...action.payload}
    default:
      return state
  }
  console.log("SERVER STORE: ", store.getState())
}

/* Socket event for someone new connecting to the server
io.on('connection', (socket) => {
  if(!users[socket.id]){
    users[socket.id] = [socket.id, " has entered the server"];
    
    // Socket event for user entering the server
    io.sockets.emit('entered', users);
    
    // Socket event for user going somewhere
    socket.on('go somewhere', function(users) {
      io.sockets.emit('go somewhere', users);
    })


    // Connection to MongoDB
    mongoose.connect(CONNECTION_URL, { useNewUrlparser: true, useUnifiedTopology: true })
    
    // Generate random map
    rand_int = Math.floor(Math.random() * 3);
    let map = null
    if (rand_int === 0)
      map = {redKey: true}
    if (rand_int === 1)
      map = {blueKey: true}
    if (rand_int === 2)
      map = {greenKey: true}

    // Create new user
    let newUser = new User({ 
      name: socket.id, 
      location: "New Location", 
      variables: map
    })

    // newUser.save()
    // .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    // .catch((error) => console.log(error.message))
  }
});
*/

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});