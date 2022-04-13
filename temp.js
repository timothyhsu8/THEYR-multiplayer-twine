let herokuInstances = "foo";

let commands = [
    `heroku apps:destroy -a aztec-${herokuInstances} --confirm aztec-${herokuInstances}`,
    `heroku create -a aztec-${herokuInstances}`, 
    `heroku buildpacks:add -a aztec-${herokuInstances} heroku-community/multi-procfile`,
    `heroku config:set -a aztec-${herokuInstances} PROCFILE=Procfile`, 
    `git push https://git.heroku.com/aztec-${herokuInstances}.git HEAD:master`,
];

herokuInstances = "bar";

console.log(commands[0]);