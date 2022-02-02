import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class JSONFS {

    constructor(home = `${__dirname}/jsonFS/data/`) {
        this.home = home;
    }

    getJSON(dirPath = this.home) {
        const files = fs.readdirSync(dirPath)
        let isArray = parseInt(files[0]);
        let container = {}
        for (let file of files) {
            if (file === ".gitignore")  // Skips gitignore file
                continue;
            
            let filePath = dirPath + file
            isArray = this.isInt(file);
            if (fs.statSync(filePath).isDirectory()) {
                container[file] = this.getJSON(filePath + "/")
            } else {
                let fileContents = fs.readFileSync(filePath, {
                    encoding: 'utf8',
                    flag: 'r'
                });
                container[file] = JSON.parse(fileContents); // Converts data back to its original type from String
            }
        };
        if (isArray) {
            container = Object.values(container)
        }
        return container;
    }

   

    setJSON(jsonObj, passedObject = "") {

        if (jsonObj !== null && (this.dataType(jsonObj) == "object" || this.dataType(jsonObj) == "array")) {


            Object.entries(jsonObj).forEach(([key, value]) => {


                if (this.dataType(value) == "array") {

                }
                if (this.dataType(value) != "object" && this.dataType(value) != "array") {

                    // console.log(passedObject, key, value)

                    let newDir = this.home + passedObject + key
                    this.delTree(newDir)
                    fs.mkdirSync(this.home + passedObject, {
                        recursive: true
                    });
                    fs.writeFileSync(newDir, JSON.stringify(value)) // Serializes data as a string in order to store as a text file





                } else {



                    return this.setJSON(value, passedObject + key + "/");
                }
            });
        }
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
        try {
            if (fs.existsSync(path)) {
                fs.rmdirSync( path, { recursive: true })
            }
        } catch(err) {
            // console.log(err)
        }
    }

}

// if (require.main === module) {
//     let testData = {
//         "title": "test2"
//     }

//     let testDataTwo = {
//         "title": {
//             "plain": "Send Money"
//         },
//         "fieldset": [{
//                 "label": {
//                     "plain": "Personal Info Section"
//                 },
//                 "fieldset": [{
//                     "field": [{
//                             "label": {
//                                 "plain": "First Name"
//                             },
//                             "value": {
//                                 "plain": "Bob"
//                             },
//                             "id": "a_1"
//                         },
//                         {
//                             "label": {
//                                 "plain": "Last Name"
//                             },
//                             "value": {
//                                 "plain": "Hogan"
//                             },
//                             "id": "a_2"
//                         }
//                     ],
//                     "id": "a_8"
//                 }],
//                 "id": "a_5"
//             },
//             {
//                 "label": {
//                     "plain": "Billing Details Section"
//                 },
//                 "fieldset": {
//                     "field": {
//                         "choices": {
//                             "choice": {
//                                 "label": {
//                                     "plain": "Gift"
//                                 },
//                                 "id": "a_17",
//                                 "switch": ""
//                             }
//                         },
//                         "label": {
//                             "plain": "Choose a category:"
//                         },
//                         "value": {
//                             "plain": "Gift"
//                         },
//                         "id": "a_14"
//                     },
//                     "fieldset": {
//                         "label": {
//                             "plain": ""
//                         },
//                         "field": [{
//                                 "choices": {
//                                     "choice": {
//                                         "label": {
//                                             "plain": "Other"
//                                         },
//                                         "id": "a_25",
//                                         "switch": ""
//                                     }
//                                 },
//                                 "label": {
//                                     "plain": "Amount"
//                                 },
//                                 "value": {
//                                     "plain": "Other" //(This could also be a dollar amount like 10.00)
//                                 },
//                                 "id": "a_21"
//                             },
//                             {
//                                 "label": {
//                                     "plain": "Other Amount"
//                                 },
//                                 "value": {
//                                     "plain": "200"
//                                 },
//                                 "id": "a_20"
//                             }
//                         ],
//                         "id": "a_26"
//                     },
//                     "id": "a_13"
//                 },
//                 "id": "a_12"
//             }
//         ]
//     }

//     let jsonFS = new JSONFS();
//     jsonFS.setJSON(testData);
//     console.log(JSON.stringify(jsonFS.getJSON()));
// }

export default JSONFS;