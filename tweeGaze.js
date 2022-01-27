import gaze from 'gaze'
import fs from 'fs'
import { exec } from 'child_process';
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
        } else if (suffix == "twee") {
            command = `tweego -f sugarcube-2  "${prefix}".twee -o "${prefix}".html`
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