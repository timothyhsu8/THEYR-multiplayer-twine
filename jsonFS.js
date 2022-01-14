const fs = require('fs');
const path = require("path")

const HOME="jsonFS/data/"

const getJSON = function(dirPath,out) {
  files = fs.readdirSync(dirPath)

  

  files.forEach(function(file) {
      let outPath= dirPath + "/" + file
    if (fs.statSync(outPath).isDirectory()) {
        let NameParse=file.split('-');
        if(NameParse.length==1)
    {
      out[file] =[getJSON(outPath, out)]
    }
    else{
        out[NameParse[0]] ={...getJSON(outPath, out)} 
    }
    } else {
     out = file;
    }
  })

  return out
}
traverse({
    s: 4,
    b: [1, {
        h: 4
    }]
})
console.log(getJSON(HOME,{}))
function traverse(jsonObj, jsonfsPath = "") {
    if (jsonObj !== null && typeof jsonObj == "object") {
        Object.entries(jsonObj).forEach(([key, value]) => {
            // key is either an array index or object key
           let outPath= jsonfsPath + `${key}`
            if (!Array.isArray(value)) {
                outPath += `-`
            }
            traverse(value, `${outPath}/`);
        });
    } else {
     
        fs.mkdirSync(HOME+jsonfsPath, { recursive: true });
        fs.closeSync(fs.openSync(HOME+jsonfsPath+jsonObj, 'w'));
     
    }
}