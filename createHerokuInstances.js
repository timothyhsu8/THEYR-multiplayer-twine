import { exec, execSync } from 'child_process';
import { createRequire } from "module";
import { exit } from 'process';
const require = createRequire(import.meta.url);
// const { clientId, clientSecret, twinePath, port } = require('./loginDiscord/config.json')
const { ...configVars } = require('./loginDiscord/config.json')

let herokuInstances = 5

for (let i = 1; i <= herokuInstances; i++) {
    let commands = [
        `heroku apps:destroy -a aztec-${i} --confirm aztec-${i}`,
        `heroku create -a aztec-${i}`, 
        `heroku buildpacks:add -a aztec-${i} heroku-community/multi-procfile`,
        `heroku config:set -a aztec-${i} PROCFILE=Procfile`, 
        `git push https://git.heroku.com/aztec-${i}.git HEAD:master`
    ]
    for (let key of Object.keys(configVars)) {
        commands.push(`heroku config:set -a aztec-${i} ${key}=${configVars[key]}`);
    }

    for (let command of commands) {
        try {
            execSync(command, console.log);
        } catch(err) {}
    }
    console.log(herokuInstances)
}