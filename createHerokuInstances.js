import { exec, execSync } from 'child_process';
import { createRequire } from "module";
import { config, exit } from 'process';
const require = createRequire(import.meta.url);
const configArray = require('./loginDiscord/configHerokuInstances.json');


let herokuInstances = 5
for (let i = 1; i <= herokuInstances; i++) {
    let configVars = configArray.shift();
    
    // Deploy Application
    let commands = [
        `heroku apps:destroy -a aztec-${i} --confirm aztec-${i}`,
        `heroku create -a aztec-${i} --buildpack heroku/nodejs`, 
        `heroku buildpacks:add -a aztec-${i} heroku-community/multi-procfile`,
        `heroku config:set -a aztec-${i} PROCFILE=Procfile`, 
        `git push https://git.heroku.com/aztec-${i}.git HEAD:master`
    ]
    
    let redirectURL = configVars['redirectURL'];
    configVars['redirectURL'] = redirectURL.replace("http%3A%2F%2Flocalhost%3A53134", encodeURIComponent(`https://aztec-${i}.herokuapp.com/`)).replace(/&/g, '"&"');
    
    // Set config variables on Heroku
    for (let key of Object.keys(configVars)) {
        let command = `heroku config:set -a aztec-${i} ${key}=${configVars[key]}`;
        commands.push(command);
    }

    // Execute commands
    for (let command of commands) {
        try {
            execSync(command, console.log);
        } catch(err) {}
    }
}