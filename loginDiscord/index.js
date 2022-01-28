import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import webstack from '../Webstack.js';
import '../tweeGaze.js';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { clientId, clientSecret, twinePath, port, discordURL } = require('./config.json');

const PORT = process.env.PORT || port
const { app } = new webstack(PORT).get();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.get('/', async ({ query }, response) => {
	const { code } = query;
	const htmlTemplate = './views/index.html'

	if (code) {
		try {
			const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${PORT}`,
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
			const userResultJson = await userResult.json();
			let userData = JSON.stringify(userResultJson);
			let userDataScript = `
			<script> let userData=${userData} </script>
			`
			let file = twinePath
			if (userResultJson.message) {
            	file = path.join(__dirname, 'index.html')
			}
			
			let fileContents = fs.readFileSync(file)
			return response.send(`${fileContents} ${userDataScript}`);
			
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
		}
	}

	console.log(discordURL)
	let htmlContents = fs.readFileSync(htmlTemplate, 'utf8')
	let foo = htmlContents.replace("discordURL", discordURL)

	return response.send(foo);
});



