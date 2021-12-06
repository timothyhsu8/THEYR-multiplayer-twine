var socket = io();

// User connects, asks server for game state
socket.on('connect', () => {
    // console.log("CONNECT SOCKET ON", socket.id);
    socket.emit('new user', socket.id);
})

// Receive state from server upon connecting
socket.on('new connection', (state) => {
    // Update game/store with the global state
    store.dispatch({type: 'UPDATESTORE', payload: state})
    store.dispatch({type: 'UPDATEGAME', payload: state})

    // If this is the first time a user is connecting, assign them a userId in local storage
    if (localStorage.getItem('userId') === null) {
        let userId = socket.id
        console.log(`User ${userId} connecting for the first time`)
        localStorage.setItem('userId', userId);
        SugarCube.State.setVar('$userId', userId);
        
        // ** Initialize variables you want a character to start out with
        SugarCube.State.variables.users[userId] = {
            name: "New Character",
            coins: 0,
            lastSeen: new Date(),
        }

        // Include in store
        state['userId'] = userId
        state['users'] = SugarCube.State.variables.users
    }

    // Returning user, get correct user state from database
    else {
        let userId = localStorage.getItem('userId')
        SugarCube.State.setVar('$userId', userId);

        // Include in store
        state['userId'] = userId
    }

    // Update game/store with your new user information
    store.dispatch({type: 'UPDATEGAME', payload: state})
    store.dispatch({type: 'UPDATESTORE', payload: state})
})


// Incoming difference, update your state and store
socket.on('difference', (state) => {
    console.log("Difference received from the server")
    store.dispatch({type: 'UPDATEGAME', payload:state})
    store.dispatch({type: 'UPDATESTORE', payload: state})
})

function reducer(state, action){
    if(typeof state === 'undefined'){
        return {...state, ...SugarCube.State.variables}
    }
    switch(action.type){
        case 'UPDATESTORE':
            console.log('Updating Store and Other Clients')
            socket.emit('difference', {...state, ...action.payload})
            return {...state, ...action.payload}
        case 'UPDATEGAME':
            console.log('Updating Game');
            updateSugarCubeState(action.payload);
            return
        default:
            return state
    }
}

var store = Redux.createStore(reducer);

setInterval(update, 100)    // Check for differences and send a socket event to the server with your current state if differences are found 

function update() {
    // delete SugarCube.State.variables.users[undefined]

    // If differences between SugarCube state and store detected, update your store and the other clients
    if(!_.isEqual(SugarCube.State.variables, store.getState())){
        let diff = difference(SugarCube.State.variables, store.getState());
        store.dispatch({type: 'UPDATESTORE', payload: diff});
        console.log("diff detected:", store.getState())
        // updateSugarCubeState(store.getState());
    }
}

function forceUpdate() {
    
}

function printVars(){
    console.log("STORE:", store.getState());
    console.log("SUGARCUBE:", SugarCube.State.variables);
}

function difference(object, base) {
	function changes(object, base) {
		return _.transform(object, function(result, value, key) {
			if (!_.isEqual(value, base[key])) {
				result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(object, base);
}

function updateSugarCubeState(new_state) {
    for (const [key, value] of Object.entries(new_state)) {
        SugarCube.State.variables[key] = value
    }
    SugarCube.Engine.show()
}

function printUser() {
    const userId = SugarCube.State.variables.userId
    console.log(`User is ${userId}`)
    console.log(SugarCube.State.variables.users[userId])
}