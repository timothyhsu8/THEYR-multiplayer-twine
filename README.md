# Heroku Lando Setup
This repository provides an easy to set up Heroku Application that utilizes a Lando development environment.

## Instructions
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
