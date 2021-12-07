# Twine Multiplayer Package
This project provides a Lando development environment that allows you to create multiplayer Twine applications

## Description
Twine Multiplayer Package was created in response to a Stony Brook University professor's issue of not having a concurrent multiplayer Twine game. Standalone Twine does not support multiplayer, but its story format SugarCube allows for Javascript, thus Twine Multiplayer Package was born. This project utilizes Lando, a development docker environment, to retrieve all the dependencies required such as Node, Mongo, and Express, much like how npm does. The details on how the Lando environment retrives all these dependencies are located in .lando.yml. Although Lando is for development only, it also directly supports Heroku, and so all development progress can be pushed to a Heroku application, right within this project. 

## Dependencies
1. Install Lando at https://lando.dev/download/

2. Create/Login a MongoDB account at https://www.mongodb.com/ and use Atlas
    - Get the MongoURI connection string and replace it in server.js

3. Create/Login a Heroku account at https://id.heroku.com/login

4. Install Twine at https://twinery.org/ to create your own story

## Getting Started
1. Clone this repository:
```
git clone https://github.com/timothyhsu8/Heroku-Lando-Test.git
```
2. Run Lando to install all of the necessary dependencies
```
lando start
```
3. Log in to your Heroku account:
```
lando heroku auth:login
```
4. Create a new Heroku project with a Node buildpack:
```
lando heroku apps:create app-name-here --buildpack heroku/nodejs
```
5. Initialize a git repository and set your Heroku application as a remote:
```
git init
git add -A
git commit -m "Initial commit."
git remote add heroku https://git.heroku.com/app-name-here.git
```
6. Deploy to Heroku
```
git push heroku master
```

## Authors
[@Alex Lau](alexlau347@gmail.com)(https://github.com/meetAlexLau)
[@Timothy Hsu](https://github.com/timothyhsu8)