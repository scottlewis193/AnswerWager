var aw = require('./index.js')
var utils = require('./utils.js')

function connect(socketid) {



    //add player to players obj
    aw.players[socketid] = utils.newPlayerObj();  
  
  utils.drawDebug();
  }

  function connectRoute(req,res) {

    res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})

    aw.players[req.query.playerId].playerName = req.query.playerName

    utils.drawDebug()

  }
  
  function disconnect(socketid) {
  
    //remove player from players object
    delete aw.players[socketid]
  
    //check if player has hosted any games and remove if needed
    //also check if player has joined any games and remove them from connected players
    for (const [gameId, game] of Object.entries(aw.games)) {
  
      if(game.hostPlayerId == socketid) {
        delete aw.games[gameId]
        break
      }
  
      if (game.playerIds.indexOf(socketid) !== -1) {
        game.splice(game.playerIds.indexOf(socketid),1)
        break
      }
  
    }
  
    utils.drawDebug();
    
  
  }

  function disconnectHostLeaves() {
    res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})
  }
  
  function createGame(req,res) {
    
    //generateGameId
    let newGameId = utils.generateGameId()
  
    //add game info to games object
    aw.games[newGameId] = utils.newGameObj(req.query.playerId)
  
    aw.games[newGameId].playerIds.push(req.query.playerId)

   utils.drawDebug();
  
     //send game-lobby screen to client
     res.render('pre-game-lobby', {playerId: req.query.playerId, gameId: newGameId, playerName: req.query.playerName, isHost: true})
  
    
  }
  
  function joinGame(req,res) {
  
    aw.games[req.get('HX-Prompt')].playerIds.push(req.query.playerId)
    utils.drawDebug();

    //send game-lobby screen to client
    res.render('pre-game-lobby', {playerId: req.query.playerId, gameId: req.get('HX-Prompt'), playerName: req.query.playerName, isHost: false})

  
  }
  
  function leaveGame(req,res) {
  
    //check if player is hosting game and if so, remove game from obj
    if (aw.games[req.params.gameId].hostPlayerId == req.query.playerId) {
      delete aw.games[req.params.gameId]
      utils.drawDebug();
      return
    }
  
    //remove player from array of playerids in game
    aw.games[req.params.gameId].playerIds.splice(aw.games[req.params.gameId].playerIds.indexOf(playerId),1)
    utils.drawDebug();

    res.render('main-menu', {playerId: req.query.playerId, playerName: req.query.playerName})
  }
  
  function updatePlayer(playerId, playerObj) {
  
    
    //only update values that have been included in request
    for (const playerKey in aw.players[playerId]) {
  
      for(const newPlayerKey in playerObj) {
  
        //bools come in as string, this will convert them to true booleans prior to comparisions
        playerObj[newPlayerKey] = utils.boolConv(playerObj[newPlayerKey]);
  
        if (playerKey == newPlayerKey) {
  
          //if key exists, update value in players obj
          aw.players[playerId][playerKey] = playerObj[newPlayerKey]
  
        }
      }
  
    }
    utils.drawDebug();
  
  }

  function getPlayerList(req,res) {
  
    var playerList = {}
  
    //check if game is still available, if not boot client back to menu
    if (req.params.gameId in aw.games) {
      if (aw.games[req.params.gameId].playerIds.length !== 0) {
          
        aw.games[req.params.gameId].playerIds.forEach(id => {
          playerList[id] = aw.players[id]})
    
    }
    
    }
    
    //if player list returns nothing assume game no longer exists and boot client back to main menu
    if (Object.keys(playerList).length == 0) {

      res.render('disconnect', {playerId: req.query.playerId})
    } else {
      //return and render player list
      res.render('player-list', {playerList: playerList, gameId: req.params.gameId})
    }


  
  }


  function checkReadyStatus(req,res) {
    utils.updateAllPlayersReadyStatus()

    res.render('start-btn',{gameId: req.params.gameId, playersReady: aw.games[req.params.gameId].playersReady})

  utils.drawDebug();
  }

  function checkAnsweredStatus(req,res) {
    utils.updateAllPlayersAnsweredStatus()


  }

  function getGameRules(req,res) {
    res.render('game-rules', {playerId: req.query.playerId})
  }

  function updatePlayer(req,res) {

    var playerVars = req.query
    playerVars.playerId = req.params.playerId

 //ready/unready btn
 if (req.query.hasOwnProperty('readyStatus')) {

  aw.players[req.params.playerId].readyStatus = utils.boolConv(req.query.readyStatus)
  playerVars.readyStatus = utils.boolConv(req.query.readyStatus)

  utils.updateAllPlayersReadyStatus()

  res.render('ready-btn',playerVars)
}

  }

  function showQuestion(questionIndex) {


  }
  
  module.exports = {connect,connectRoute,disconnect,createGame,joinGame,leaveGame,updatePlayer,getPlayerList,disconnectHostLeaves,checkReadyStatus,checkAnsweredStatus,getGameRules,updatePlayer}