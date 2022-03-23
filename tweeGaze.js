import gaze from 'gaze'
import fs from 'fs'
import { exec } from 'child_process';
import Extwee, { HTMLWriter, StoryFormat, StoryFormatParser, TweeWriter } from 'extwee'

let coolDown = 0;

// Watch all .js files/dirs in process.cwd() 
gaze('Twine/*.*', function (err, watcher) {
    // Files have all started watching 
    // watcher === this

    
    console.log('Watching files...');

    // Get all watched files 
    var watched = this.watched();
    console.log(watched)
    
    // On file changed 
    this.on('changed', function (filepath) {
        
        let [suffix, ...prefix] = filepath.split(".").reverse();
        prefix = prefix.reverse().join(".");
        let command;

        if (suffix == "html") {
            command = `tweego -f sugarcube-2 -d -o "${prefix}".twee "${prefix}".html`
            // command = `node ./node_modules/twine-utils/bin/entwee.js "${prefix}.${suffix}" > "${prefix}.tw"`
        } else if (suffix == "twee" || suffix == "tw") {
            // let file = new Extwee.FileReader(`${prefix}.twee`);
            // let tp = new Extwee.TweeParser(file.contents);
            // let sfp = new StoryFormatParser("storyformats/sugarcube-2/format.js")
            // new HTMLWriter(`${prefix}.html`, tp.story, sfp.storyformat)  // Write to HTML file
            
            
            command = `tweego -f sugarcube-2  "${prefix}".twee -o "${prefix}".html`
            // command = `node ./node_modules/twine-utils/bin/entwine.js "${prefix}.${suffix}" -f "storyformats/sugarcube-2/format.js" > "${prefix}.html"`
        } 
        else {
            console.log(prefix, suffix)
            return
        }
        
        const mtime = fs.statSync(filepath).mtime;
        if (mtime - coolDown > 1000) {
            coolDown = mtime
           // Executes shell command 
            exec(command, (err, stdout, stderr) => { // tweego -d -o index.twee index.html
                if (err) {
                    //some err occurred
                    console.error(err)
                } else {
                    // the *entire* stdout and stderr (buffered)
                    // console.log(`stdout: ${stdout}`);
                }
            });

            console.log(filepath + ' was changed');
        }
    });

    // Get watched files with relative paths 
    var files = this.relative();
});