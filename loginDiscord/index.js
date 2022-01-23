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
	const { code } = query;

	if (code) {
		try {
			const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}`,
					scope: 'identify',
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await oauthResult.json();

			const userResult = await fetch('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
				},
			});
			const userResultJson= await userResult.json();
			let userData=JSON.stringify(userResultJson);
			let userDataScript=`
			<script>let userData=${userData}</script>
			`
			let file=twinePath
			if(userResultJson.message){
             file=path.join(__dirname, 'index.html')
			}
			let fileContents = fs.readFileSync(file)
			return response.send(`${fileContents} ${userDataScript}`);
			
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
		}
	}

	return response.sendFile(path.join(__dirname, 'index.html'));
});



