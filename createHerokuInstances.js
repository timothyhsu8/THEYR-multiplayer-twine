import { exec, execSync } from 'child_process';
import { createRequire } from "module";
import { config, exit } from 'process';
const require = createRequire(import.meta.url);
const configArray = require('./login/config.json')
const { clientId, clientSecret, twinePath, port } = configArray[0];


let herokuInstances = configArray.length;
for (let i = 1; i <= herokuInstances; i++) {
    let configVars = configArray.shift();
    
    // Deploy Application
    let commands = [
        `heroku apps:destroy -a theyr-${i} --confirm theyr-${i}`,
        `heroku create -a theyr-${i} --buildpack heroku/nodejs`, 
        `heroku buildpacks:add -a theyr-${i} heroku-community/multi-procfile`,
        `heroku config:set -a theyr-${i} PROCFILE=Procfile`, 
        `git push https://git.heroku.com/theyr-${i}.git HEAD:master`
    ]
    
    let redirectURL = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(`https://theyr-${i}.herokuapp.com/`).replace(/&/g, '"&"')}&response_type=code&scope=identify%20guilds.members.read%20guilds`;
    configVars['redirectURL'] = redirectURL;
    
    // Set config variables on Heroku
    for (let key of Object.keys(configVars)) {
        let command = `heroku config:set -a theyr-${i} ${key}=${configVars[key]}`;
        commands.push(command);
    }

    // Execute commands
    for (let command of commands) {
        try {
            execSync(command, console.log);
        } catch(err) {}
    }
}