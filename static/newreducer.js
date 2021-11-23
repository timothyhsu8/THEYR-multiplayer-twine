var socket = io();

socket.on('connect', () => {
    console.log("CONNECT SOCKET ON", socket.id);
    socket.emit('new user', socket.id);
    if(window.localStorage.hasOwnProperty('userID')){ //checks if connected user has userID in localStorage
        console.log("Brand New User has joined")
    }
    /*
    We want to have User Objects added to the ServerStore/DB
    TODO:
    1: Edit the Twine story such that players can pick up coins = User={UserName, numberOfCoins}
    2: When a player connects, the server checks if the User exists, if true, return their User data & game state, else return game state
        a: Check thier localStorage for a UserID
        b: Query the database for that UserID and return their User data
    3: Each User(Client) will have their own User Object = {UserID, numberOfCoins} and the game state
    4: The ServerStore will have an array of Users[], and the game state

     */
  })

socket.on('new connection', (gstate) => {
    console.log('CLIENT, getting server state', gstate);
    store.dispatch({type: 'UPDATEGAME', payload: gstate})
    store.dispatch({type: 'UPDATESTORE', payload: gstate})
})

socket.on('difference', (state) => {
    store.dispatch({type: 'UPDATEGAME', payload:state})
    store.dispatch({type: 'UPDATESTORE', payload: state})
})

function reducer(state, action){
    if(typeof state === 'undefined'){
        return {...state, ...SugarCube.State.variables}
    }
    switch(action.type){
        case 'UPDATESTORE':
            console.log('Updating Store')
            socket.emit('difference', {...state, ...action.payload})
            return {...state, ...action.payload}
        case 'UPDATEGAME':
            console.log('Updating Game');
            updateSugarCubeState(SugarCube.State.variables, action.payload);
            return
        default:
            return state
    }
}

var store = Redux.createStore(reducer);

function update(){
    //console.log(store.getState());
    //console.log(difference(SugarCube.State.variables, store.getState()));
    //console.log("DIFF:" + diff);
    //printVars();
    let diff = difference(SugarCube.State.variables, store.getState());
    if(!_.isEqual(diff, store.getState)){
        console.log("DIFF:", difference(SugarCube.State.variables, store.getState()));
        store.dispatch({type: 'UPDATESTORE', payload: diff});
        updateSugarCubeState(SugarCube.State.variables, store.getState());
    }
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

function updateSugarCubeState(old_state, new_state) {
    for (const [key, value] of Object.entries(new_state)) {
        old_state[key] = value
    }
    SugarCube.Engine.show()
}