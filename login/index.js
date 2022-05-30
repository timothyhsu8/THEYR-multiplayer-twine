import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'
import webstack from '../Webstack.js'
import '../tweeGaze.js'
import { fileURLToPath } from 'url';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const configArray = require('./config.json')
const { clientId, clientSecret, twinePath, port } = configArray[0];

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || port
const { app } = new webstack(PORT).get();

const htmlTemplate = 'login/index.html';
const TWINE_PATH = 'Twine/demo.html';

app.get('/', async ({ query }, response) => {
	const userData = query;

	if (userData.nick) {
		return returnTwine(userData, response);
	}

	else {
		let htmlContents = fs.readFileSync(htmlTemplate, 'utf8')

		response.send(htmlContents);
	}
});

function returnTwine(userData, response) {
	let userDataScript=`
		<script>let userData=${JSON.stringify(userData)}</script>
	`
	let file = TWINE_PATH
	let fileContents = fs.readFileSync(file)
	return response.send(`${fileContents} ${userDataScript}`);
}