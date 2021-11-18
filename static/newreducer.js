var socket = io();

socket.on('connect', function(state){
    console.log("NEW CONNECTION, ", state)
    console.log(store.getState())
    let diff = difference(store.getState(), state)
    if(diff.length === 0){
        console.log("NO DIFFERENCE")
    }
    else{
        store.dispatch({type: 'UPDATE', payload: state})
        SugarCube.State.variables = store.getState();
        SugarCube.Engine.show()
    }
})

socket.on('difference', function(new_state){
    console.log("DIFF FOUND, ", new_state)
    let diff = difference(SugarCube.State.variables, store.getState());
    if(diff.length === 0){
        console.log("NO DIFFERENCE")
    }
    else{
        store.dispatch({type: 'UPDATE', payload: new_state});
        SugarCube.State.variables = store.getState();
        SugarCube.Engine.show()
    }
})

function reducer(state, action){
    if(typeof state === 'undefined'){
        return {...state, ...SugarCube.State.variables}
    }
    switch(action.type){
        case 'UPDATE':
            console.log({...state, ...action.payload});
            socket.emit('difference', {...state, ...action.payload}) //causes error state not iterable
            return {...state, ...action.payload}
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
    console.log("DIFF:", difference(SugarCube.State.variables, store.getState()));
    store.dispatch({type: 'UPDATE', payload: diff});
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