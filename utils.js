const aw = require('./index.js')

//FUNCTIONS

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
  
  function getPlayerList(gameId) {
  
    var playerList = {}
  
  //check if game is still available, if not boot client back to menu
  if (gameId in aw.games) {
    if (aw.games[gameId].playerIds.length !== 0) {
        
      aw.games[gameId].playerIds.forEach(id => {
        playerList[id] = aw.players[id]})
  
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

  module.exports = {generateGameId,updateAllPlayersReadyStatus,getPlayerList,getCurrentTime,drawDebug,boolConv}