const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoStateSchema = new Schema({
    state: {
        type: Map
    }
}
)

let MongoState = mongoose.model("MongoState", mongoStateSchema)
module.exports = MongoState