var socket = io();

// When a socket event comes in, update state if there's a difference
socket.on('check diff', function (server_state) {
    let diff = _.differenceWith([SugarCube.State.variables], [server_state], _.isEqual)

    // No difference in state, do nothing
    if (diff.length === 0) {
        console.log("No Difference")
    }

    // Difference in state, update your SugarCube state
    else {
        updateSugarCubeState(SugarCube.State.variables, server_state)
        SugarCube.Engine.show()  // Refreshes the passage
        // console.log(SugarCube.State.variables)
    }
});

// Every 1 second, send a socket event to the server with your current state
setInterval(checkDiff, 1000)

// Send a socket event to the server with your current state
function checkDiff() {
    socket.emit('check diff', SugarCube.State.variables)
}

// Updates your SugarCube variables with the new state (Becuase justdoing 'SugarCube.State.variables = something' doesn't work)
function updateSugarCubeState(old_state, new_state) {
    for (const [key, value] of Object.entries(new_state)) {
        old_state[key] = value
    }
}


// ****** BELOW FUNCTIONS ARE JUST USED FOR TESTING ****** //

function printSugarcubeVariables() {
    console.log(SugarCube.State.passage)
    // console.log(SugarCube.State.variables)
    // let server_state = {stars: 20, name: "New State Name"}
    // updateSugarCubeState(SugarCube.State.variables, server_state)
    // console.log(SugarCube.State.variables)
}

function printLodashDiff() {
    var objects = [{ 'x': 1, 'y': 2 }];
    console.log(_.differenceWith(objects, [{ 'x': 40, 'y': 2 }], _.isEqual));
}