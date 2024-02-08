const aw = require('./index.js')




//FUNCTIONS

function newPlayerObj() {
  return {
    playerName: '', 
    readyStatus: false,
    answeredStatus: false, 
    points: 0, 
    exactCorrectAnswers: 0, 
    correctAnswers: 0, 
    mostPointsEarnedRound: 0, 
    highestOddsWon: ''
  };
}

function newGameObj(hostPlayerId) {
  return {
    hostPlayerId: hostPlayerId, 
    playerIds: [],
    playersReady: false, 
    playersAnswered: false,
    state: 'preGameLobby',
    questions: {
      0: {
        text: 'TEST QUESTION?',
        type: 'integer'
      }
    },
    questionIndex: 0
  };
}



function generateGameId() {

    let gameId = String(Math.floor(Math.random() * 10))
  
      for (let i = 0; i < 5; i++) {
        gameId += String(Math.floor(Math.random()* 10))
      }
  
      return gameId
  
  }
  
  
  function updateAllPlayersReadyStatus() {
  
    for (const gameId in aw.games) {
      aw.games[gameId].playersReady = true
      for (let i = 0; i < aw.games[gameId].playerIds.length; i++) {
  
        if (aw.players[aw.games[gameId].playerIds[i]].readyStatus == false) {
      
          aw.games[gameId].playersReady = false; 
          break;
        }
  
      }
    }
  
  drawDebug()
  }

  function updateAllPlayersAnsweredStatus() {

    for (const gameId in aw.games) {
      aw.games[gameId].playersReady = true
      for (let i = 0; i < aw.games[gameId].playerIds.length; i++) {
  
        if (aw.players[aw.games[gameId].playerIds[i]].answeredStatus == false) {
      
          aw.games[gameId].playersAnswered = false; 
          break;
        }
  
      }
    }

  }
  

  
  function getCurrentTime() {
    var today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  }
  
  function drawDebug() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");console.clear();
    console.log('░█▀█░█▀█░█▀▀░█░█░█▀▀░█▀▄░░░█░█░█▀█░█▀▀░█▀▀░█▀▄')
    console.log('░█▀█░█░█░▀▀█░█▄█░█▀▀░█▀▄░░░█▄█░█▀█░█░█░█▀▀░█▀▄')
    console.log('░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀░▀░▀░░░▀░▀░▀░▀░▀▀▀░▀▀▀░▀░▀')
    console.log('server running at http://localhost:3000');
    console.log('')
    console.log(`PLAYERS: ${Object.keys(aw.players).length}`)
    console.log(aw.players)
    console.log(`GAMES: ${Object.keys(aw.games).length}`)
    console.log(aw.games)
  }
  
  function boolConv(boolStr) {
    if (boolStr === "true") {return true}
    if (boolStr === "false") {return false}
    return boolStr
  }

  module.exports = {generateGameId,updateAllPlayersReadyStatus,getCurrentTime,drawDebug,boolConv,newPlayerObj,newGameObj,updateAllPlayersAnsweredStatus}