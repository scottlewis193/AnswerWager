var aw = require("./index.js");
var utils = require("./utils.js");

function connect(socketid) {
  //add player to players obj
  aw.players[socketid] = utils.newPlayerObj();

  utils.drawDebug();
}

function connectRoute(req, res) {
  res.render("main-menu", {
    playerId: req.query.playerId,
    playerName: req.query.playerName,
  });

  aw.players[req.query.playerId].playerName = req.query.playerName;

  utils.drawDebug();
}

function disconnect(socketid) {
  //remove player from players object
  delete aw.players[socketid];

  //check if player has hosted any games and remove if needed
  //also check if player has joined any games and remove them from connected players
  for (const [gameId, game] of Object.entries(aw.games)) {
    if (game.hostPlayerId == socketid) {
      delete aw.games[gameId];
      break;
    }

    if (game.playerIds.indexOf(socketid) !== -1) {
      game.splice(game.playerIds.indexOf(socketid), 1);
      break;
    }
  }

  utils.drawDebug();
}

function disconnectHostLeaves(req, res) {
  const PLAYERID = req.query.playerId;
  const PLAYERNAME = req.query.playerName;

  res.render("main-menu", { playerId: PLAYERID, playerName: PLAYERNAME });
}

function createGame(req, res) {
  const NEWGAMEID = utils.generateGameId();
  const PLAYERID = req.query.playerId;
  const PLAYERNAME = req.query.playerName;

  //add game info to games object
  aw.games[NEWGAMEID] = utils.newGameObj(PLAYERID);

  aw.games[NEWGAMEID].playerIds.push(PLAYERID);

  utils.drawDebug();

  //send game-lobby screen to client
  res.render("pre-game-lobby", {
    playerId: PLAYERID,
    gameId: NEWGAMEID,
    playerName: PLAYERNAME,
    isHost: true,
  });
}

function joinGame(req, res) {
  const GAMEID = req.get("HX-Prompt");
  const PLAYERID = req.query.playerId;
  const PLAYERNAME = req.query.playerName;

  aw.games[GAMEID].playerIds.push(PLAYERID);
  utils.drawDebug();

  //send game-lobby screen to client
  res.render("pre-game-lobby", {
    playerId: PLAYERID,
    gameId: GAMEID,
    playerName: PLAYERNAME,
    isHost: false,
  });
}

function leaveGame(req, res) {
  const GAMEID = req.query.gameId;
  const PLAYERID = req.query.playerId;

  //check if player is hosting game and if so, remove game from obj
  if (aw.games[GAMEID].hostPlayerId == PLAYERID) {
    delete aw.games[GAMEID];
    utils.drawDebug();
    return;
  }

  //remove player from array of playerids in game
  aw.games[GAMEID].playerIds.splice(
    aw.games[GAMEID].playerIds.indexOf(PLAYERID),
    1
  );
  utils.drawDebug();

  res.render("main-menu", {
    playerId: PLAYERID,
    playerName: req.query.playerName,
  });
}

// function updatePlayer(req,res) {

//   const PLAYEROBJ = req.query

//   //only update values that have been included in request
//   for (const playerKey in aw.players[playerId]) {

//     for(const newPlayerKey in PLAYEROBJ) {

//       //bools come in as string, this will convert them to true booleans prior to comparisions
//       PLAYEROBJ[newPlayerKey] = utils.boolConv(PLAYEROBJ[newPlayerKey]);

//       if (playerKey == newPlayerKey) {

//         //if key exists, update value in players obj
//         aw.players[playerId][playerKey] = PLAYEROBJ[newPlayerKey]

//       }
//     }

//   }
//   utils.drawDebug();

// }

function getPlayerList(req, res) {
  const GAMEID = req.params.gameId;
  const PLAYERID = req.query.playerId;

  var playerList = {};

  //check if game is still available, if not boot client back to menu
  if (GAMEID in aw.games) {
    if (aw.games[GAMEID].playerIds.length !== 0) {
      aw.games[GAMEID].playerIds.forEach((id) => {
        playerList[id] = aw.players[id];
      });
    }
  }

  //if player list returns nothing assume game no longer exists and boot client back to main menu
  if (Object.keys(playerList).length == 0) {
    res.render("disconnect", { playerId: PLAYERID });
  } else {
    //return and render player list
    res.render("player-list", { playerList: playerList, gameId: GAMEID });
  }
}

function submitAnswer(req, res) {
  const GAMEID = req.params.gameId;
  const PLAYERID = req.query.playerId;
  const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
  const SUBMITTEDANSWER = req.query.submittedAnswer;

  aw.players[PLAYERID].answeredStatus = true;
  aw.players[PLAYERID].answers[QUESTIONINDEX] = { answer: SUBMITTEDANSWER };

  utils.drawDebug();
}

function checkReadyStatus(req, res) {
  const GAMEID = req.params.gameId;

  utils.updateAllPlayersReadyStatus();

  res.render("start-btn", {
    gameId: GAMEID,
    playersReady: aw.games[GAMEID].playersReady,
  });

  utils.drawDebug();
}

function checkAnsweredStatus(req, res) {
  const GAMEID = req.params.gameId;

  utils.updateAllPlayersAnsweredStatus();

  if (aw.games[GAMEID].playersAnswered) {
    //process answers
    const PROCESSEDANSWERS = utils.processAnswers(GAMEID);

    res.render("wager-board", { answers: PROCESSEDANSWERS });
  } else {
    //send empty response if all players haven't submitted an answer
    res.sendStatus(204);
  }

  utils.drawDebug();
}

function getGameRules(req, res) {
  const PLAYERID = req.query.playerId;

  res.render("game-rules", { playerId: PLAYERID });
}

function updatePlayer(req, res) {
  var playerVars = req.query;
  playerVars.playerId = req.params.playerId;

  //ready/unready btn
  if (req.query.hasOwnProperty("readyStatus")) {
    aw.players[req.params.playerId].readyStatus = utils.boolConv(
      req.query.readyStatus
    );
    playerVars.readyStatus = utils.boolConv(req.query.readyStatus);

    utils.updateAllPlayersReadyStatus();

    res.render("ready-btn", playerVars);
  }
}

function showQuestion(req, res) {
  const GAMEID = req.params.gameId;
  const PLAYERID = req.query.playerId;
  const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
  let questionObj = aw.games[GAMEID].questions[QUESTIONINDEX];
  questionObj.gameId = GAMEID;
  questionObj.playerId = PLAYERID;

  res.render("question", questionObj);
}

module.exports = {
  connect,
  connectRoute,
  disconnect,
  createGame,
  joinGame,
  leaveGame,
  updatePlayer,
  getPlayerList,
  disconnectHostLeaves,
  checkReadyStatus,
  checkAnsweredStatus,
  getGameRules,
  updatePlayer,
  submitAnswer,
  showQuestion,
};
