const PORT = process.env.PORT || 5000

const api = axios.create({
    baseURL: 'http://localhost:' + PORT + '/api',
})

function getUsers(){
    console.log(PORT)
    promise = api.get("/users")
    return promise.then(function(response) {
        console.log(response.data)
        return response.data
    })
    .catch(error => console.error(error));
}

function printSugarcubeVariables() {
    console.log(SugarCube.State.variables)
}