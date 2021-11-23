const express = require('express');
const app = express();
const http = require("http")
const server = http.createServer(app)
const Redux = require('redux')
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const MongoState = require('./MongoStateSchema');

app.use("/static", express.static('./static/'));

const PORT = process.env.PORT || 5000
const CONNECTION_URL = 'mongodb+srv://timhsu:M3AMNhKlV0TyPscj@users.xnee2.mongodb.net/myFirstDatabase?'

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/socket_game.html');
})

app.get('/coins/', (req, res) => {
  res.sendFile(__dirname + '/Coins.html');
})

// All socket.io related events
io.on('connection', (socket) => {
  mongoose.connect(CONNECTION_URL, { useNewUrlparser: true, useUnifiedTopology: true })
  let gstate = serverStore.getState();
  console.log("GSTATE:", serverStore.getState());

  socket.on('check diff', (state) => {
    socket.broadcast.emit('check diff', state)  // socket.broadcast sends event to all clients except the sender
  })

  socket.once('new user', (id) => {
    console.log("SERVER RECEIVES NEW USER:", id);
    if(typeof gstate !== 'undefined'){
      socket.emit('new connection',gstate)
    }
  })

  socket.on('difference', (state) => {
    serverStore.dispatch({type: 'UPDATE', payload: state})
    console.log(serverStore.getState());
    socket.broadcast.emit('difference', state)
    // var query = {''}
	
    updateMongoState(state)
  })
});

function reducer(state, action){
    switch(action.type){
        case 'UPDATE':
          return {...state, ...action.payload}
        default:
          return state
    }
}

// Updates the state in MongoDB when a client makes a change to the game
async function updateMongoState(state) {
	try {
		let oldMongoState = await MongoState.findOne()
		
		// If the state in MongoDB has never been set before, create it
		if (oldMongoState === null) {		
			let newState = new MongoState({
				state: state
			})
			newState.save()
		}
		
		// If the state in MongoDB already exists, update it
		else {	
			const updatedState = {
				state: state
			}	
			
			await MongoState.findByIdAndUpdate(oldMongoState._id, updatedState)
		}
		
	} catch (err) {
		throw new Error(err)
	}
}

var serverStore = Redux.createStore(reducer);
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})