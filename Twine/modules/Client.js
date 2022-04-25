var socket = io();
var store = Redux.createStore(reducer);
var stateReceived = false;
let lastUpdate = new Date();
// console.log("SOCKET IS", socket);

// If userData exists already, set your ID in localStorage
// if(userData){
//     setId(userData.id)   
// }

// Sets the UserId in the Users mapping
// ISSUE: This won't run unless the passage reloads using the reloadPassage() function (BECAUSE STORY LOADS BEFORE THIS CLIENT FILE IS LOADED)
// $(document).one(":storyready", () => {
//     console.log("STORY READY");
//     // let users = Window.SugarCubeState.getVar('$users');

//     // // If Users map is not defined, initialize it
//     // if (users === undefined){
//     //     users = {}
//     // } 

//     // // If client does not exist in Users, add them
//     // if(!(userData.id in users)) {
//     //     users[userData.id] = {}
//     //     users[userData.id].username= userData.username
//     //     Window.SugarCubeState.setVar('$users', users);
//     // }  
//     // SugarCube.setup.theyrCallback();
// });

// // User connects, asks server for game state
socket.on('connect', () => {
    socket.emit('new user', socket.id);
})

// Receive state from server upon connecting, then update all other clients that you've connected
function startSockets() {
    // socketTest();
    let promise = new Promise((resolve, reject) => {
        socket.on('new connection', (state) => {
            // // If this is the first time a user is connecting, assign them a userId in local storage
            // if (localStorage.getItem('userId') === null) {
            //     setId(socket.id)
            // }
    
            // // Returning user, get correct user state from database
            // else {
            //     setId(localStorage.getItem('userId'))
            // }
    
    
            console.log("Connecting state:", state)
            console.log("Current State:", Window.SugarCubeState.variables)
    
            // If the server's state is empty, set with this client's state
            if (_.isEqual(state, {})) {
                state = Window.SugarCubeState.variables
            }
    
            // If server's state doesn't have your id yet, set it with this client's state
            let userId = Window.SugarCubeState.variables.userId
            if (state.users[userId] === undefined) {
                state.users[userId] = Window.SugarCubeState.variables.users[userId];
            }
    
            store.dispatch({type: 'UPDATEGAME', payload: state, connecting: true})
            store.dispatch({type: 'UPDATESTORE', payload: state, connecting: true})
            stateReceived = true;
            resolve(state);
        })    
    });
    return promise;
}

// Incoming difference, update your state and store
socket.on('difference', (state) => {
    console.log("Difference received from the server")
    store.dispatch({type: 'UPDATEGAME', payload:state})
    store.dispatch({type: 'UPDATESTORE', payload: state, noUpdate: true})
})

// Reducer to update your store and send the difference to all other clients
function setId(userId){
    localStorage.setItem('userId', userId);
    Window.SugarCubeState.setVar('$userId', userId);
}

function reducer(state, action){
    
    // Checks for undefined to prevent feedback loop. Skips undefined check if connecting to the game (updates game as soon as client joins)
    // if(state === undefined && action.connecting !== undefined) {
    //     console.log("State is undefined")
    //     return {...state, ...Window.SugarCubeState.variables}
    // }

    switch(action.type){
        case 'UPDATESTORE':
            console.log('Updating Store and Other Clients', action.payload)
            if (!action.noUpdate) {
                console.log("Difference emitted")
                socket.emit('difference', {...state, ...action.payload})
            }
            $(document).trigger(":liveupdate");
            // if (!action.self && !action.connecting && lastUpdate < new Date() - 1000) {
            //     reloadPassage();
            // }
            return _.cloneDeep(Window.SugarCubeState.variables)
        case 'UPDATEGAME':
            console.log('Updating Game', action.payload);
            updateSugarCubeState(action.payload);
            $(document).trigger(":liveupdate");
            return
        default:
            return state
    }
}

setInterval(update, 100)    // Check for differences and send a socket event to the server with your current state if differences are found 

// If differences between SugarCube state and store detected, update your store and the other clients
function update() {
    if(!_.isEqual(Window.SugarCubeState.variables, store.getState())){
        let diff = difference(Window.SugarCubeState.variables, store.getState());
        console.log('diff detected', diff)
        store.dispatch({type: 'UPDATESTORE', payload: diff, self: true});
        // store.dispatch({type: 'UPDATESTORE', payload: Window.SugarCubeState.variables});   // Old dispatch call
    }
}

// Finds the difference between 2 different objects (Used to compare SugarCube State and Store)
function difference(object, base) {
	function changes(object, base) {
		return _.transform(object, function(result, value, key) {
            try {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            }
            catch(err) {
                // console.log("Error in diff:", err);
            }
		});
	}
	return changes(object, base);
}

// Updates client's SugarCube State when state changes are received from the server
function updateSugarCubeState(new_state) {
    for (const [key, value] of Object.entries(new_state)) {
        Window.SugarCubeState.variables[key] = value
    }
    // reloadPassage();
}

// Reloads the passage while keeping scroll position
// function reloadPassage() {
//     // if (Window.SugarCubeState.passage !== "Character Identification")
//     // console.log("SugarCube Passage:", SugarCube.)
//     let scrollX = window.scrollX
//     let scrollY = window.scrollY
//     SugarCube.Engine.show();
//     window.scrollTo(scrollX, scrollY)
// } 

console.log("Client finished loading");