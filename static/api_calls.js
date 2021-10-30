const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

function getUsers(){
    promise = api.get("/users")
    return promise.then(function(response) {
        return response.data
    })
    .catch(error => console.error(error));
}

const apis = {
    getUsers
}