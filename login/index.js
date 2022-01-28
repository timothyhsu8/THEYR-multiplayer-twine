import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'
import webstack from '../Webstack.js'
import '../tweeGaze.js'
import { fileURLToPath } from 'url';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { clientId, clientSecret, twinePath, port } = require('./config.json')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || port
const { app } = new webstack(PORT).get();

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