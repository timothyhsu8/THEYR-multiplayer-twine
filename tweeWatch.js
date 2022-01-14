const fs= require('fs');
const { exec } = require('child_process');

// Include process module
const process = require('process');
  
// Printing current directory
console.log("Current working directory: ~~~",
    process.cwd());

fs.watch('/app/Twine', (eventType, filename) => {

	[suffix, ...prefix] = filename.split(".").reverse()
	console.log(prefix)

	if (suffix == "html") {
	let command = `tweego -f sugarcube-2 -d -o Twine/${prefix}.twee Twine/${prefix}.html`
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

	console.log(eventType,filename)
})