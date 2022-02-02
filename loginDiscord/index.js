import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import webstack from '../Webstack.js';
import '../tweeGaze.js';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Comment these out for pushing to heroku
// let { clientId, clientSecret, twinePath, port, redirectURL, herokuURL } = require('./config.json');

const CLIENT_ID = process.env.clientId || clientId
const CLIENT_SECRET = process.env.clientSecret || clientSecret
const TWINE_PATH = process.env.twinePath || twinePath
const REDIRECTURL = process.env.redirectURL || redirectURL
const PORT = process.env.PORT || port
const HEROKU_URL = process.env.herokuURL || herokuURL


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
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: HEROKU_URL,
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
			let file = TWINE_PATH
			if (userResultJson.message) {
				return response.send(JSON.stringify(userResultJson));
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

	let htmlContents = fs.readFileSync(htmlTemplate, 'utf8')
	let foo = htmlContents.replace("redirectURL", REDIRECTURL)

	return response.send(foo);
});



