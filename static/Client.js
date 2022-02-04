var socket = io();
if(userData){
    setId(userData.id)   
}

$(document).one(':passageinit', () => {
	console.log("STORY READY")
    let users = SugarCube.State.getVar('$users');
    
    // If Users map is not defined, initialize it
    if (users === undefined){
        users = {}
    } 

    // If client does not exist in Users, add them
    if(!(userData.id in users)) {
        users[userData.id] = {}
        users[userData.id].name= userData.username
        SugarCube.State.setVar('$users', users);
        console.log(SugarCube.State.variables)
    }  
});

// User connects, asks server for game state
socket.on('connect', () => {
    socket.emit('new user', socket.id);
})

// Receive state from server upon connecting
socket.on('new connection', (state) => {

    // If this is the first time a user is connecting, assign them a userId in local storage
    if (localStorage.getItem('userId') === null) {
        setId(socket.id)
    }

    // Returning user, get correct user state from database
    else {
        setId(localStorage.getItem('userId'))
    }

    store.dispatch({type: 'UPDATEGAME', payload: state})
    store.dispatch({type: 'UPDATESTORE', payload: state})
    console.log("NEW CONNECTION")
})


// Incoming difference, update your state and store
socket.on('difference', (state) => {
    console.log("Difference received from the server")
    store.dispatch({type: 'UPDATEGAME', payload:state})
    store.dispatch({type: 'UPDATESTORE', payload: state})
})

// Reducer to update your store and send the difference to all other clients
function setId(userId){
    localStorage.setItem('userId', userId);
    SugarCube.State.setVar('$userId', userId);
}

function reducer(state, action){
    if(typeof state === 'undefined'){
        return {...state, ...SugarCube.State.variables}
    }
    switch(action.type){
        case 'UPDATESTORE':
            console.log('Updating Store and Other Clients', action.payload)
            socket.emit('difference', {...state, ...action.payload})
            SugarCube.Engine.show()
            return {...state, ...action.payload}
        case 'UPDATEGAME':
            console.log('Updating Game', action.payload);
            updateSugarCubeState(action.payload);
            return
        default:
            return state
    }
}

var store = Redux.createStore(reducer);

setInterval(update, 100)    // Check for differences and send a socket event to the server with your current state if differences are found 

// Checks for changes between SugarCube State and Store, update other clients if difference is detected
function update() {
    // If differences between SugarCube state and store detected, update your store and the other clients
    if(!_.isEqual(SugarCube.State.variables, store.getState())){
        console.log("SUGARCUBE", SugarCube.State.variables)
        console.log("STORE", store.getState())
        let diff = difference(SugarCube.State.variables, store.getState());
        console.log("diff detected:", diff)
        store.dispatch({type: 'UPDATESTORE', payload: SugarCube.State.variables});
        // store.dispatch({type: 'UPDATESTORE', payload: diff});    // Old dispatch call
    }
}

// Print SugarCube State and Store
function printVars(){
    console.log("STORE:", store.getState());
    console.log("SUGARCUBE:", SugarCube.State.variables);
}

// Finds the difference between 2 different objects (Used to compare SugarCube State and Store)
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

// Updates client's SugarCube State when state changes are received from the server
function updateSugarCubeState(new_state) {
    for (const [key, value] of Object.entries(new_state)) {
        SugarCube.State.variables[key] = value
    }
    SugarCube.Engine.show()
}

// Prints User information in the console
function printUser() {
    const userId = SugarCube.State.variables.userId
    console.log(`User is ${userId}`)
    console.log(SugarCube.State.variables.users[userId])
}