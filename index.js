//REQUIRE

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const readlineSync = require("readline-sync");
const fs = require('fs');

//LIVE RELOAD SETUP

const livereload = require("livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(join(__dirname, 'public'));
const connectLivereload = require("connect-livereload");

//EXPRESS SETUP
const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'pug')
app.use(connectLivereload());

app.use(express.static('public'))
app.use(express.static('lib'))
app.set('views', './views')



//LIVE RELOAD

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


//ROUTES

app.get('/', (req, res) => {
  res.render('start-page', {playerName: 'John'})
})

app.get('/connect', (req,res) => {
  res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})
  players[req.query.playerId].name = req.query.playerName
})

app.get('/games/create', (req,res) => {

console.log(req.query.playerId)

//create game and return id
let newGameId = handleCreateGame(req.query.playerId)

//send game-lobby screen to client
res.render('pre-game-lobby', {playerId: req.query.playerId, gameId: newGameId, playerName: req.query.playerName})

})

app.get('/games/join',(req,res) => {

  let gameId = req.get('HX-Prompt')

  handleJoinGame(gameId,req.query.playerId)

//send game-lobby screen to client
res.render('pre-game-lobby', {playerId: req.query.playerId, gameId: gameId, playerName: req.query.playerName})

})

app.get('/games/:gameId/playerlist', (req,res) => {

  let playerList = getPlayerlist(req.params.gameId)

  //if player list returns nothing assume game no longer exists and boot client back to main menu
  if (playerList.length == 0) {
    res.render('disconnect', {playerId: req.query.playerId})
  } else {
    //return and render player list
    res.render('player-list', {playerList: playerList, gameId: req.params.gameId})
  }

 
  
})

app.get('/games/disconnect', (req,res) => {

//this is mainly for clients who get disconnected from a game when the host leaves
//if this was handled through the get playerlist route, unwanted UI would be left over

res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})


})

app.get('/games/:gameId/leave', (req,res) => {

handleLeaveGame(req.params.gameId,req.query.playerId)

res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})

})

app.get('/game-rules', (req,res) => {

res.render('game-rules', {playerId: req.query.playerId})

})


//SOCKET.IO

io.on('connection', (socket) => {
   
    handleConnect(socket.id)


    socket.on('disconnect', () => {
    
      handleDisconnect(socket.id)

    });
  });

//EXPRESS

server.listen(3000, () => {
  drawDebug()
});

//VARS

var games = {}
var players = {}
var exit = false


//FUNCTIONS

function generateGameId() {

  let gameId = String(Math.floor(Math.random() * 10))

    for (let i = 0; i < 5; i++) {
      gameId += String(Math.floor(Math.random()* 10))
    }

    return gameId

}

function handleConnect(socketid) {



  //add player to players obj
  players[socketid] = {
    name: '', 
    readyStatus: false, 
    points: 0, 
    exactCorrectAnswers: 0, 
    correctAnswers: 0, 
    mostPointsEarnedRound: 0, 
    highestOddsWon: ''
};  

drawDebug();
}

function handleDisconnect(socketid) {

  //remove player from players object
  delete players[socketid]

  //check if player has hosted any games and remove if needed
  //also check if player has joined any games and remove them from connected players
  for (const [gameId, game] of Object.entries(games)) {

    if(game.hostPlayerId == socketid) {
      delete games[gameId]
      break
    }

    if (game.playerIds.find(socketid)) {
      game.splice(game.playerIds.indexOf(socketid),1)
      break
    }

  }

  drawDebug();
  

}

function handleCreateGame(playerId) {
  
  //generateGameId
  let newGameId = generateGameId()

  //add game info to games object
  games[newGameId] = {
    hostPlayerId: playerId, 
    playerIds: [], 
    state: 'preGameLobby'
  };

  games[newGameId].playerIds.push(playerId)

  drawDebug();

  return newGameId

  
}

function handleJoinGame(gameId,playerId) {

  games[gameId].playerIds.push(playerId)
  drawDebug();

}

function handleLeaveGame(gameId,playerId) {

  //check if player is hosting game and if so, remove game from obj
  if (games[gameId].hostPlayerId == playerId) {
    delete games[gameId]
    drawDebug();
    return
  }

  //remove player from array of playerids in game
  games[gameId].playerIds.splice(games[gameId].playerIds.indexOf(playerId),1)
  drawDebug();
}

function getPlayerlist(gameId) {

  var playerList = []

//check if game is still available, if not boot client back to menu
if (gameId in games) {
  if (games[gameId].playerIds.length !== 0) {
  
    games[gameId].playerIds.forEach(id => {playerList.push(players[id].name)})

}

}


return playerList

}

function getCurrentTime() {
  var today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

function drawDebug() {
  console.clear()
  console.log('░█▀█░█▀█░█▀▀░█░█░█▀▀░█▀▄░░░█░█░█▀█░█▀▀░█▀▀░█▀▄')
  console.log('░█▀█░█░█░▀▀█░█▄█░█▀▀░█▀▄░░░█▄█░█▀█░█░█░█▀▀░█▀▄')
  console.log('░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀░▀░▀░░░▀░▀░▀░▀░▀▀▀░▀▀▀░▀░▀')
  console.log('server running at http://localhost:3000');
  console.log('')
  console.log(`PLAYERS: ${Object.keys(players).length}`)
  console.log(players)
  console.log(`GAMES: ${Object.keys(games).length}`)
  console.log(games)
}




 
  
