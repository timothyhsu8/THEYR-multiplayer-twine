const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String
    },
    location: {
        type: String
    },
    variables: {
        type: Map
    }
    }
)

let User = mongoose.model("User", userSchema)
module.exports = User