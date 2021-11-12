const ADD_RUBIES1 = 'ADD_RUBIES1';
const SUB_RUBIES1 = 'SUB_RUBIES1';
const ADD_RUBIES2 = 'ADD_RUBIES2';
const SUB_RUBIES2 = 'SUB_RUBIES2';
const UPDATESTATE = 'UPDATESTATE';
const initialState = {      //store
    room1rubies: SugarCube.State.variables.room1rubies,
    room2rubies: SugarCube.State.variables.room2rubies
}

function add_rubies(state = initialState, action){      //reducer adding
    switch(action.type){
        case ADD_RUBIES1:
        state.room1rubies = state.room1rubies + action.payload
        return{
            state
        };

        case ADD_RUBIES2:
        state.room2rubies = state.room2rubies + action.payload
        return{
            state
        }
    }
}

function sub_rubies(state = initialState, action){      //reducer subtracting
    switch(action.type){
        case SUB_RUBIES1:
        state.room1rubies = state.room1rubies - action.payload
        return{
            state
        };

        case SUB_RUBIES2:
        state.room2rubies = state.room2rubies - action.payload
        return{
            state
        }
    }
}

function reducer(state = initialState, action){
    switch(action.type){
        case UPDATESTATE:

    }
}

function add_rubies1(){
    console.log("add_rubies1")
    add_rubies(initialState, {type: 'ADD_RUBIES1', payload: 10})
}

function add_rubies2(){
    console.log("add_rubies2")
    if(initialState.room1rubies -10 < 0)
    add_rubies(initialState, {type: 'ADD_RUBIES2', payload: 10})
}

function sub_rubies1(){
    console.log("sub_rubies1")
    sub_rubies(initialState, {type: 'SUB_RUBIES1', payload: 10})
}

function sub_rubies2(){
    console.log("sub_rubies1")
    sub_rubies(initialState, {type: 'SUB_RUBIES2', payload: 10})
}

