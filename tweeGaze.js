var gaze = require('gaze');
const { exec } = require('child_process');

// Watch all .js files/dirs in process.cwd() 
gaze('Twine/*.html', function(err, watcher) {
    // Files have all started watching 
    // watcher === this 
    console.log('Watching files...');

    // Get all watched files 
    var watched = this.watched();

    // On file changed 
    this.on('changed', function(filepath) {
        [suffix, ...prefix] = filepath.split(".").reverse()
        console.log(prefix, suffix)

        if (suffix == "html") {
            let command = `tweego -f sugarcube-2 -d -o ${prefix}.twee ${prefix}.html`
            console.log(command)
        
            // Executes shell command to convert .html file to .twee file
            exec(command, (err, stdout, stderr) => {					// tweego -d -o index.twee index.html
                if (err) {
                    //some err occurred
                    console.error(err)
                } else {
                    // the *entire* stdout and stderr (buffered)
                    // console.log(`stdout: ${stdout}`);
                }
            });
        }

        console.log(filepath + ' was changed');
    });

    // Get watched files with relative paths 
    var files = this.relative();
});