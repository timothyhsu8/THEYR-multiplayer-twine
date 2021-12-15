const fs= require('fs');
fs.watch('./Twine', (eventType, filename) => {

	console.log(eventType,filename)
})