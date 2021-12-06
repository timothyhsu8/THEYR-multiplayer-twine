const express = require('express');
const app = express();
const http = require("http")
const server = http.createServer(app)
const Redux = require('redux')
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const MongoState = require('./MongoStateSchema');
const User = require('./UserSchema')

app.use("/static", express.static('./static/'));

const PORT = process.env.PORT || 5000
const CONNECTION_URL = 'mongodb+srv://timhsu:M3AMNhKlV0TyPscj@users.xnee2.mongodb.net/myFirstDatabase?'
// const CONNECTION_URL = 'mongodb://database:27017/mean'

mongoose.connect(CONNECTION_URL, function (error) {
	if (error) {
		console.log(error)
	}

	console.log('Database state is ' + mongoose.connection.readyState)
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/Coins.html');
})

// All socket.io related events
io.on('connection', (socket) => {
	let gstate = serverStore.getState();

	// User connects 
	socket.once('new user', (id) => {
		console.log("SERVER RECEIVES NEW USER:", id);

		// If server has global state, send it to the user
		if (typeof gstate !== 'undefined') {
			socket.emit('new connection', gstate)
		}

		// If server does not have the global state, retrieve it from MongoDB and send it to the user
		else {
			console.log("Retrieving state from mongo")
			retrieveMongoState().then((mongoState) => {
				io.to(id).emit('difference', mongoState.state)
			})
		}
	})

	// Difference found in SugarCube State, update all clients and MongoDB
	socket.on('difference', (state) => {
		serverStore.dispatch({ type: 'UPDATE', payload: state })
		socket.broadcast.emit('difference', state)

		updateMongoState(state)
	})


	// Client connects for the first time, create a new user for them in Mongo and send it back to the client
	socket.on('create new user', (socketId) => {
		createUser(socketId).then((userData) => {
			io.to(socketId).emit('obtain user state', userData)
		})
	})


	// Client is returning, retrieve their user information from Mongo
	socket.on('retrieve user state', (clientInfo) => {
		let socketId = clientInfo.socketId
		let userId = clientInfo.userId

		// Retrieve user data and send it to the client who requested it
		retrieveUser(userId).then((userData) => {
			io.to(socketId).emit('obtain user state', userData)
		})
	})
});

function reducer(state, action) {
	switch (action.type) {
		case 'UPDATE':
			return { ...state, ...action.payload }
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

// Retrieves current state from MongoDB. If it doesn't exist, creates it.
async function retrieveMongoState() {
	let mongoState = await MongoState.findOne()

	// If the state in MongoDB has never been set before, create it
	if (mongoState === null) {
		let newState = new MongoState({
			state: state
		})
		newState.save()
		return newState
	}

	return mongoState
}


// Client connects for the first time, create a new user for them in Mongo
async function createUser(socketId) {
	const newUser = new User({
		userId: socketId,
		variables: {
			userId: socketId,
			coins: 0
		}
	})

	newUser.save()
	return newUser.variables
}


// Client is returning, retrieve their user information from Mongo
async function retrieveUser(userId) {
	try {
		const user = await User.findOne({ userId: userId })
		return user.variables
	}
	catch (err) {
		throw new Error(err)
	}
}

var serverStore = Redux.createStore(reducer);
server.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})