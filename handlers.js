var aw = require('./index.js')
var utils = require('./utils.js')

function connect(socketid) {



    //add player to players obj
    aw.players[socketid] = {
      playerName: '', 
      readyStatus: false, 
      points: 0, 
      exactCorrectAnswers: 0, 
      correctAnswers: 0, 
      mostPointsEarnedRound: 0, 
      highestOddsWon: ''
  };  
  
  utils.drawDebug();
  }

  function connectRoute(playerId,playerName) {
    aw.players[playerId].playerName = playerName

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
  
  function createGame(playerId) {
    
    //generateGameId
    let newGameId = utils.generateGameId()
  
    //add game info to games object
    aw.games[newGameId] = {
      hostPlayerId: playerId, 
      playerIds: [],
      playersReady: false, 
      state: 'preGameLobby',
      questions: {
        0: {
          text: 'TEST QUESTION?',
          type: 'integer'
        }
      },
      questionIndex: 0
    };
  
    aw.games[newGameId].playerIds.push(playerId)
  
  utils.drawDebug();
  
    return newGameId
  
    
  }
  
  function joinGame(gameId,playerId) {
  
    aw.games[gameId].playerIds.push(playerId)
    utils.drawDebug();
  
  }
  
  function leaveGame(gameId,playerId) {
  
    //check if player is hosting game and if so, remove game from obj
    if (aw.games[gameId].hostPlayerId == playerId) {
      delete aw.games[gameId]
      utils.drawDebug();
      return
    }
  
    //remove player from array of playerids in game
    aw.games[gameId].playerIds.splice(aw.games[gameId].playerIds.indexOf(playerId),1)
    utils.drawDebug();
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
  
  module.exports = {connect,connectRoute,disconnect,createGame,joinGame,leaveGame,updatePlayer}