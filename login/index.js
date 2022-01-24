const fetch = require('node-fetch');
const path = require('path');
const fs=require('fs');
const webstack= require('../Webstack')
const { clientId, clientSecret, twinePath,port } = require('./config.json');
const {app} = new webstack(port).get();
require('../tweeGaze');

//const PORT = process.env.PORT || 5000
const PORT=port

app.get('/', async ({ query }, response) => {
	const userData = query;

	if (userData.id) {

	
			let userDataScript=`
			<script>let userData=${JSON.stringify(userData)}</script>
			`
			let fileContents = fs.readFileSync(twinePath)
			return response.send(`${fileContents} ${userDataScript}`);
			
	
	}

	return response.sendFile(path.join(__dirname, 'index.html'));
});



