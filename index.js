//REQUIRE

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

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
  console.log('send pug')
})

app.get('/connect', (req,res) => {
  res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})
  players[req.query.playerId].name = req.query.playerName
})

app.get('/creategame', (req,res) => {

//create game and return id
let newGameId = handleCreateGame(req.query.playerId)

//send game-lobby screen to client
res.render('pre-game-lobby', {playerId: req.query.playerId, gameId: newGameId, playerName: req.query.playerName})

})

app.get('/joingame',(req,res) => {



})

app.get('/games/:gameId/playerlist', (req,res) => {
  var gameId = req.params.gameId

  res.render('player-list', {playerList: getPlayerlist(gameId)})
  
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
  console.log('server running at http://localhost:3000');
});

//VARS

var games = {}
var players = {}



//FUNCTIONS

function generateGameId() {

  let gameId = String(Math.floor(Math.random() * 10))

    for (i = 0; i < 5; i++) {
      gameId += String(Math.floor(Math.random()* 10))
    }

    return gameId

}

function handleConnect(socketid) {

  console.log(`${socketid} connected`);

  //add player to players obj
  players[socketid] = {name: '', readyStatus: false, points: 0, exactCorrectAnswers: 0, correctAnswers: 0, mostPointsEarnedRound: 0, }


}

function handleDisconnect(socketid) {

  console.log(`${socketid} disconnected`);

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
  

}

function handleCreateGame(playerId) {
  
  //generateGameId
  let newGameId = generateGameId()

  //add game info to games object
  games[newGameId] = {hostPlayerId: playerId, playerIds: [], state: 'preGameLobby'}
  games[newGameId].playerIds.push(playerId)

  console.log(`${playerId} has started hosting a game (${newGameId})`);

  console.log(games)

  return newGameId

  
}

function handleJoinGame(gameId,playerId) {

}

function getPlayerlist(gameId) {

  var playerList = []
  games[gameId].playerIds.forEach(id => {
    playerList.push(players[id].name)
  })
  
  return playerList
}

