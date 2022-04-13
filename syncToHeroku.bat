set /A herokuInstances=5
FOR /l %%G in (1,1,%herokuInstances%) DO (
    echo heroku create -a aztec-%%G
    heroku create -a aztec-%%G
    heroku buildpacks:add -a aztec-%%G heroku-community/multi-procfile
    heroku config:set -a aztec-%%G PROCFILE=Procfile
    git push https://git.heroku.com/aztec-%%G.git HEAD:master
)