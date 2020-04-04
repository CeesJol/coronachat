# CoronaChat

A chat app for seniors who feel lonely during corona time to talk to each other, anonymously.

## Overview
### General functionality
The chat requires only a username. The user can join a room from a list of rooms displayed on the main page. If no room is selected, the server will select the best room for them.

### XSS
An [XSS sanitizer](https://www.npmjs.com/package/xss) is used to sanitize all input from the client. This should prevent XSS attacks on the server or on clients, but I'm by no means an expert on this.

### bcrypt admin
A user can login to become an admin by opening the console and using the requestAdmin(password) function. The password is stored as hash in the server. It is hashed by [bcrypt](https://www.npmjs.com/package/bcrypt).

### Privacy
The server does not store any data, neither does it (read: should it) log any data. However, google analytics are enabled, and the username and room name are stored in the url. So through analytics, the username and room name may still be visible to the host. The conversations in the chat, however, are in no way stored.

## Development
### Automatic deploys
The main chat app is hosted at [Heroku](https://seniorenchat.herokuapp.com/). Automatic deployment is enabled from the master branch.

The development version is hosted at [a different Heroku url](https://coronachat-dev.herokuapp.com/), which has automatic deployment from the staging branch.

## Getting started

1. Install [Node](https://nodejs.org/en/download/)
2. Run `npm install` and `npm start`
3. Use the app by visiting `localhost:3000` (or whatever port is used)
