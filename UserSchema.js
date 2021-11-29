const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    userId: {
        type: String
    },
    variables: {
        type: Map
    }
})

let User = mongoose.model("User", userSchema)
module.exports = User