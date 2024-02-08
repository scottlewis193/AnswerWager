//Local requires
const aw = require('./index.js')
const handlers = require('./handlers.js');
const utils = require('./utils.js');








//ROUTES

aw.app.get('/', (req, res) => {
  res.render('start-page', {playerName: 'John'})
})

aw.app.get('/connect', (req,res) => {
  res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})

  handlers.connectRoute(req.query.playerId,req.query.playerName)

})

aw.app.get('/games/create', (req,res) => {


//create game and return id
let newGameId = handlers.createGame(req.query.playerId)

//send game-lobby screen to client
res.render('pre-game-lobby', {playerId: req.query.playerId, gameId: newGameId, playerName: req.query.playerName, isHost: true})

})

aw.app.get('/games/join',(req,res) => {

  let gameId = req.get('HX-Prompt')

  handlers.joinGame(gameId,req.query.playerId)

//send game-lobby screen to client
res.render('pre-game-lobby', {playerId: req.query.playerId, gameId: gameId, playerName: req.query.playerName, isHost: false})

})

aw.app.get('/games/:gameId/playerlist', (req,res) => {

  let playerList = utils.getPlayerList(req.params.gameId)

  //if player list returns nothing assume game no longer exists and boot client back to main menu
  if (Object.keys(playerList).length == 0) {

    res.render('disconnect', {playerId: req.query.playerId})
  } else {
    //return and render player list
    res.render('player-list', {playerList: playerList, gameId: req.params.gameId})
  }

 
  
})

aw.app.get('/games/disconnect', (req,res) => {

//this is mainly for clients who get disconnected from a game when the host leaves
//if this was handled through the get playerlist route, unwanted UI would be left over

res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})


})

aw.app.get('/games/:gameId/leave', (req,res) => {

handlers.leaveGame(req.params.gameId,req.query.playerId)

res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})

})

aw.app.get('/games/:gameId/readycheck', (req,res) => {
  utils.updateAllPlayersReadyStatus()

    res.render('start-btn',{gameId: req.params.gameId, playersReady: aw.games[req.params.gameId].playersReady})

  utils.drawDebug();
  
})

aw.app.get('/game-rules', (req,res) => {

res.render('game-rules', {playerId: req.query.playerId})

})

aw.app.get('/players/:playerId/update', (req,res) => {

  var playerVars = req.query
  playerVars.playerId = req.params.playerId

  handlers.updatePlayer(req.params.playerId,req.query)


  //ready/unready btn
  if (req.query.hasOwnProperty('readyStatus')) {

   
    utils.updateAllPlayersReadyStatus()

    res.render('ready-btn',playerVars)
  }

 

})