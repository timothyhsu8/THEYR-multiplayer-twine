import express from 'express';
import Db from './db.js'
import Redux from 'redux'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});
const database = new Db()

class Webstack {
	constructor(port) {
		this.port=port;
		app.use("/static", express.static('./static/'));
		this.serverStore = Redux.createStore(this.reducer);
		this.initIO();
		http.listen(this.port, () => console.log(`App listening at http://localhost:${this.port}`));
	}
	get() {

		return {
			app
		}
	}

	reducer(state, action) {
		switch (action.type) {
			case 'UPDATE':
				return {
					...state, ...action.payload
				}
				default:
					return state
		}
	}
	initIO() {
	
		io.on('connection', (socket) => {
			let gstate = this.serverStore.getState();

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
				delete state['userId'] // Removes userId from the global state (Prevents users overriding each other's userId variables)
				this.serverStore.dispatch({
					type: 'UPDATE',
					payload: state
				})
				socket.broadcast.emit('difference', state)

				database.setData(state) // Updates the database
				// updateMongoState(state)
			})
		});
	}
}



export default Webstack;