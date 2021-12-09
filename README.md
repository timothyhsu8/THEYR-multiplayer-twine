<p align="center">
  <img src="https://res.cloudinary.com/dsry3cnco/image/upload/v1638989534/their_logo_d1rgmw.png" alt="Their Logo"/>
</p>

# Their (Twine Multiplayer Package)
"Their" provides a development environment that allows anyone to create multiplayer <a href="https://twinery.org/">Twine</a> applications using the <a href="http://www.motoslave.net/sugarcube/2/">SugarCube</a> story format.

## Description
"Their" was created in response to a Stony Brook University professor's need for a real-time updating multiplayer Twine game. Standalone Twine only provides support for single player stories, but through the SugarCube story format, JavaScript, and  <a href="https://socket.io/">Socket.IO</a>, multiplayer Twine becomes possible. This project utilizes  <a href="https://lando.dev/">Lando</a>, which sets up your development environment instantly so that you don't have to manually install all of the dependencies yourself. This includes linking the application to your <a href="https://www.heroku.com/">Heroku</a> account, so once you've written your Twine story, all you have to do is follow the instructions below to deploy the application to Heroku and make your game available to play over the web!

## How It Works
If you're familiar with SugarCube, you'll know that the variables for a Twine story are stored within the SugarCube State. In order to provide a multiplayer experience, "Their" uses sockets to ensure that each player's SugarCube State is synchronized with every other player in the game. This happens in realtime, so when one player does something that changes the state of the game, a socket event is sent to all of the other clients to reflect these new changes. <br/><br/>
That's it! You don't need to do anything extra to your Twine- the multiplayer features will come automatically from "Their".

## What You'll Need to Get Started
1. Install Lando at https://lando.dev/download/

2. Create a MongoDB Atlas account and follow this tutorial to create a cluster for your application: https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/

3. Create a Heroku account at https://id.heroku.com/login

4. Install Twine at https://twinery.org/ and create your own story

## Instructions
### Clone this Github Repository

1. Clone this repository:
```
git clone https://github.com/timothyhsu8/THEIR-multiplayer-twine.git
```
2. Go into the 'THEIR-multiplayer-twine' directory and run Lando to install all of the necessary dependencies:
```
lando start
```
After 'lando start' has completed, some green links will appear in your console. You can click on 'lando-heroku-sockets.lndo.site' to see your Twine story.

### Connect to your MongoDB Database

1. Replace the CONNECTION_URL in server.js with the MongoDB Atlas URI obtained from the tutorial
```
const CONNECTION_URL = 'YOUR_MONGO_URI_HERE'
```
### Create your Twine Story

1. Open MultiplayerTemplate.html in Twine and use it to create your story.

### Deploy to Heroku

1. Log in to your Heroku account:
```
lando heroku auth:login
```
2. Create a new Heroku project with a Node buildpack:
```
lando heroku apps:create app-name-here --buildpack heroku/nodejs
```
3. Initialize a git repository and set your Heroku application as a remote:
```
git init
git add -A
git commit -m "Initial commit."
git remote add heroku https://git.heroku.com/app-name-here.git
```
4. Deploy to Heroku
```
git push heroku master
```

## Authors
- [@Alex Lau](https://github.com/meetAlexLau)
    - alexlau347@gmail.com
- [@Timothy Hsu](https://github.com/timothyhsu8)
    - timothy.hsu@stonybrook.edu
