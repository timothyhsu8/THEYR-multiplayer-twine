import gaze from 'gaze'
import fs from 'fs'
import { exec } from 'child_process';
import Extwee, { HTMLWriter, StoryFormat, StoryFormatParser, TweeWriter } from 'extwee'

let coolDown = 0;

// Watch all .js files/dirs in process.cwd() 
gaze('Twine/*.*', function (err, watcher) {

    // Get all watched files 
    var watched = this.watched();
    console.log(watched)
    
    // On file changed 
    this.on('changed', function (filepath) {
        // Execute command
        const mtime = fs.statSync(filepath).mtime;
        if (mtime - coolDown > 1000) {
            coolDown = mtime

            let [suffix, ...prefix] = filepath.split(".").reverse();
            prefix = prefix.reverse().join(".");
            let command;

            if (suffix == "html") {
                let outFile = `${prefix}.tw`
                fs.truncate(outFile, 0, ((err) => {}))

                command = `node ./node_modules/twine-utils/bin/entwee.js "${prefix}.${suffix}" > "${outFile}"`
                // command = `tweego -f sugarcube-2 -d -o "${prefix}".twee "${prefix}".html`
            } 
            else if (suffix == "twee" || suffix == "tw") {
                let file = new Extwee.FileReader(`${prefix}.${suffix}`);
                let tp = new Extwee.TweeParser(file.contents);
                let start = tp.story.metadata.start
                
                command = `node ./node_modules/twine-utils/bin/entwine.js "${prefix}.${suffix}" -f "storyformats/sugarcube-2/format.js" > "${prefix}.html" -s "${start}"`
                // command = `tweego -f sugarcube-2  "${prefix}".twee -o "${prefix}".html`
            } 
            else {
                console.log(prefix, suffix)
                return
            }

            // Executes shell command 
            exec(command, (err, stdout, stderr) => { // tweego -d -o index.twee index.html
                if (err) {
                    console.error(err)
                }
            });

            console.log(filepath + ' was changed');
        }
    });

    // Get watched files with relative paths 
    var files = this.relative();
});