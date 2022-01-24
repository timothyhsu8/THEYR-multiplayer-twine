const JSONFS = require('./jsonfs')

class Db {
    constructor(data) {
        this.data = data
        this.jsonFs = new JSONFS();
    }

    // Returns the data within the database
    getData() {
        return this.jsonFs.getJSON()
    }

    // Sets the data variable and saves to the data folder
    setData(newData) {
        this.data = newData
        this.saveData(newData)
    }

    // Saves data to the data folder
    saveData(data) {
        this.jsonFs.setJSON(data)
    }
}

module.exports = Db;