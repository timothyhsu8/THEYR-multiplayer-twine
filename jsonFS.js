import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const data_path = `${__dirname}${path.sep}jsonFS${path.sep}data${path.sep}`

class JSONFS {

    constructor(home = data_path) {
        this.home = home;
    }

    getJSON(dirPath = this.home) {
        const files = fs.readdirSync(dirPath)
        let isArray;
        let container = {}
        for (let file of files) {   // File can be file or directory
            if (file === ".gitignore")  // Skips gitignore file
                continue;
           
            isArray = this.isInt(file);
            // isArray = this.isInt(file) && file < 100000;
            
            let filePath = dirPath + file

            // File is an object, remove '-' from first and last index
            if (file.charAt(0) === '-' && file.charAt(file.length - 1) === '-')
                file = file.slice(1, file.length - 1)

            if (fs.statSync(filePath).isDirectory()) {
                container[file] = this.getJSON(filePath + path.sep)
                // console.log(file, container[file])
            } else {
                let fileContents = fs.readFileSync(filePath, {
                    encoding: 'utf8',
                    flag: 'r'
                });

                if (file === '{}') {
                    container = {};
                }

                else {
                    container[file] = JSON.parse(fileContents); // Converts data back to its original type from String
                }
            }
        };
        if (isArray) {
            container = Object.values(container)
        }
        console.log("container:", container)
        return container;
    }

    setJSON(jsonObj, passedObject = "") {
        console.log({passedObject, jsonObj});
        if (jsonObj !== null && (this.dataType(jsonObj) == "object" || this.dataType(jsonObj) == "array")) {
            if (JSON.stringify(jsonObj) === '{}') {
                this.setKeyPair("{}", "", passedObject);
            }
            
            Object.entries(jsonObj).forEach(([key, value]) => {
                this.setKeyPair(key, value, passedObject);
            });
        }
    }

    setKeyPair(key, value, passedObject) {
        if (this.dataType(value) != "object" && this.dataType(value) != "array") {
            let newDir = this.home + passedObject + key
            this.delTree(newDir)
            try {
                fs.mkdirSync(this.home + passedObject, {
                    recursive: true
                });
                fs.writeFileSync(newDir, JSON.stringify(value)) // Serializes data as a string in order to store as a text file
            } catch(err) {
                console.log(err);
            }

        } else {
            // let newDir = this.home + passedObject + key
            if (this.dataType(value) === "object") {
                key = `-${key}-`
            }

            // console.log("Key is", key)
            // console.log(value, passedObject + key + path.sep)
            return this.setJSON(value, passedObject + key + path.sep);
        }
    }

    wipeData() {
        let path = data_path
        this.delTree(path)
        fs.mkdirSync(path, {
            recursive: true
        });
    }

    isInt(value) {
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));
    }

    dataType(jsonObj) {
        var dtype;
        if (jsonObj !== null && typeof jsonObj == "object") {
            if (Array.isArray(jsonObj)) {
                dtype = 'array';
            } else dtype = 'object';
        } else {
            dtype = 'string';
        }
        return dtype;

    }
    
    delTree(path) {
        if (fs.existsSync(path)) {
            let statsObj = fs.statSync(path)
            if (statsObj.isDirectory()) {
                fs.rmdirSync( path, { recursive: true })
            }    
        }
    }

}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
    let testData = {
        "title": "test2",
        "array": ["Tim"],
        "users": {
            "123456789": {
                "name": "Paul",
                "coins": 23
            }
        }
    }

    let jsonFS = new JSONFS();
    jsonFS.wipeData();
    // jsonFS.setJSON(testData);
    // console.log(JSON.stringify(jsonFS.getJSON()));
}

export default JSONFS;