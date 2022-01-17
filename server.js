const express = require('express');
const app = express();
const http = require("http")
const server = http.createServer(app)
const Redux = require('redux')
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const MongoState = require('./MongoStateSchema');
const Db = require('./db')
require('./tweeGaze');

// Include process module
// const process = require('process');

let database = new Db()

app.use("/static", express.static('./static/'));

const PORT = process.env.PORT || 5000
const CONNECTION_URL = 'mongodb+srv://timhsu:M3AMNhKlV0TyPscj@users.xnee2.mongodb.net/myFirstDatabase?'	// **REPLACE WITH YOUR OWN MONGODB ATLAS URL

// Connect to MongoDB Database
mongoose.connect(CONNECTION_URL, function (error) {
	if (error) {
		console.log(error)
	}
	// console.log('Database state is ' + mongoose.connection.readyState)
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/Twine/index.html');	
})

// All socket.io related events
io.on('connection', (socket) => {
	let gstate = serverStore.getState();

	// User connects 
	socket.once('new user', (id) => {
		console.log("SERVER RECEIVES NEW USER:", id);

		// If server has global state, send it to the user
		if (typeof gstate !== 'undefined') {
			io.to(id).emit('new connection', gstate)
		}

		// If server does not have the global state, retrieve it from the database and send it to the user
		else {
			console.log("Retrieving state from mongo", database.getData())
			io.to(id).emit('new connection', database.getData())
			// retrieveMongoState().then((mongoState) => {
			// 	io.to(id).emit('new connection', mongoState.state)
			// })
		}
	})

	// Difference found in SugarCube State, update all clients and MongoDB
	socket.on('difference', (state) => {
		delete state['userId']	// Removes userId from the global state (Prevents users overriding each other's userId variables)
		serverStore.dispatch({ type: 'UPDATE', payload: state })
		socket.broadcast.emit('difference', state)

		database.setData(state) // Updates the database
		// updateMongoState(state)
	})
});

// Reducer that updates the server store whenever a client updates the game state
function reducer(state, action) {
	switch (action.type) {
		case 'UPDATE':
			return { ...state, ...action.payload }
		default:
			return state
	}
}

// Updates the state in the database when a client makes a change to the game
async function updateMongoState(state) {
	try {
		let oldMongoState = await MongoState.findOne()
		
		const updatedState = {
			state: state
		}

		await MongoState.findByIdAndUpdate(oldMongoState._id, updatedState)		

	} catch (err) {
		throw new Error(err)
	}
}

// Retrieves current state from MongoDB. If it doesn't exist, creates it.
async function retrieveMongoState() {
	let mongoState = await MongoState.findOne()

	// If the state in MongoDB has never been set before, create it
	if (mongoState === null) {
		console.log("Initializing Mongo State")
		let newState = new MongoState({
			state: {
				users: {}
			}
		})
		newState.save()
		return newState
	}

	return mongoState
}


var serverStore = Redux.createStore(reducer);
server.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})