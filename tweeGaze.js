import gaze from 'gaze'
import fs, { existsSync } from 'fs'
import { exec, execFile } from 'child_process';
import Extwee, { HTMLWriter, StoryFormat, StoryFormatParser, TweeWriter } from 'extwee'

let tweegoBinaries = {"win32":"binaries/tweego-2.1.1-windows-x64", "linux":"binaries/tweego-2.1.1-macos-x64", "darwin":"binaries/tweego-2.1.1-macos-x64"};
let tweeBinary = tweegoBinaries[process.platform] || tweegoBinaries["linux"];
console.log({tweeBinary});
console.log("In twee gaze");
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
            let command, args;
            if (suffix == "html") {
                let outFile = `${prefix}.tw`
                fs.truncate(outFile, 0, ((err) => {}))

                // command = `node ./node_modules/twine-utils/bin/entwee.js "${prefix}.${suffix}" > "${outFile}"`
                command = `${tweeBinary}/tweego`;
                args = ["-f", "sugarcube-2", "-d", "-o", `${prefix}.twee`, `${prefix}.html`];
            } 
            else if (suffix == "twee" || suffix == "tw") {
                // let file = new Extwee.FileReader(`${prefix}.${suffix}`);
                // let tpstory = new Extwee.TweeParser(file.contents).story;
                // console.log(tpstory.passages[0]);
                // let start = tpstory.metadata?.start || tpstory.passages[tpstory.metadata.startnode-1].name;
                // command = `node ./node_modules/twine-utils/bin/entwine.js "${prefix}.${suffix}" -f "storyformats/sugarcube-2/format.js" > "${prefix}.html" -s "${start}"`
                // command = `tweego -f sugarcube-2  "${prefix}".twee -o "${prefix}".html`
                command = `${tweeBinary}/tweego`
                args = ["-f", "sugarcube-2", `${prefix}.${suffix}`, "-o", `${prefix}.html`];
            } 
            else {
                console.log(prefix, suffix)
                return
            }

            // Executes shell command 
            execFile(command, args, (err, stdout, stderr) => { 
                if (err) {
                    console.error(err)
                }
            });

            // console.log(existsSync());
            // console.log(existsSync(`${prefix}.${suffix}`))
            console.log(filepath + ' was changed');
        }
    });

    // Get watched files with relative paths 
    var files = this.relative();
});