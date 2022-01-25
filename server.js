import express from 'express'
import http from 'http'
import Redux from 'redux'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import Db from './db.js';
import './tweeGaze.js'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url';
// import MongoState from './MongoStateSchema';
const app = express();
const server = http.createServer(app)
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Include process module
// const process = require('process');

let database = new Db()

app.use("/static", express.static('./static/'));
app.use(express.json());

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
	res.sendFile(__dirname + '/login.html');	
	// res.sendFile(__dirname + '/Twine/index.html');	
})

app.post('/joingame', urlencodedParser, (req, res) => {
	req.body; // JavaScript object containing the parse JSON
  	res.json(req.body);
	// res.sendFile(__dirname + '/Twine/index.html');	
})

// All socket.io related events
io.on('connection', (socket) => {
	let gstate = serverStore.getState();

	// User connects 
	socket.once('new user', (id) => {
		try {
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
		} catch(err) {
			throw new Error(err)
		}
	})

	// Difference found in SugarCube State, update all clients and MongoDB
	socket.on('difference', (state) => {
		try {
			delete state['userId']	// Removes userId from the global state (Prevents users overriding each other's userId variables)
			serverStore.dispatch({ type: 'UPDATE', payload: state })
			socket.broadcast.emit('difference', state)

			database.setData(state) // Updates the database
			// updateMongoState(state)
		} catch(err) {
			throw new Error(err)
		}
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