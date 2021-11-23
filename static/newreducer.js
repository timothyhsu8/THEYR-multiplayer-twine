var socket = io();

socket.on('connect', () => {
    console.log("CONNECT SOCKET ON", socket.id);
    socket.emit('new user', socket.id);
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
    printVars();
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