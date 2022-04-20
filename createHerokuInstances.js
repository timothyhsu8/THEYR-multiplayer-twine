import { exec, execSync } from 'child_process';
import { createRequire } from "module";
import { exit } from 'process';
const require = createRequire(import.meta.url);
// const { clientId, clientSecret, twinePath, port } = require('./loginDiscord/config.json')
const { ...configVars } = require('./loginDiscord/config.json')


let herokuInstances = 5
let redirectURL = configVars['redirectURL'];
for (let i = 1; i <= herokuInstances; i++) {
    let commands = [
        `heroku apps:destroy -a aztec-${i} --confirm aztec-${i}`,
        `heroku create -a aztec-${i} --buildpack heroku/nodejs`, 
        // `heroku buildpacks:set heroku/nodejs`,
        `heroku buildpacks:add -a aztec-${i} heroku-community/multi-procfile`,
        `heroku config:set -a aztec-${i} PROCFILE=Procfile`, 
        `git push https://git.heroku.com/aztec-${i}.git HEAD:master`
    ]

    configVars['herokuURL'] = `https://aztec-${i}.herokuapp.com/`;
    configVars['redirectURL'] = redirectURL.replace("http%3A%2F%2Flocalhost%3A53134", encodeURIComponent(`https://aztec-${i}.herokuapp.com/`)).replace(/&/g, '"&"');
    console.log(configVars['redirectURL']);
    for (let key of Object.keys(configVars)) {
        let command = `heroku config:set -a aztec-${i} ${key}=${configVars[key]}`;
        console.log(command);
        commands.push(command);
    }

    for (let command of commands) {
        try {
            execSync(command, console.log);
        } catch(err) {}
    }
    console.log(herokuInstances)
}