// import the necessary functions and objects
import * as aw from "./app.js";
import WebSocket, { WebSocketServer } from "ws";
import { Player, Game, Players, Games, Answer, Answers, Question, Questions, BoardAnswer, BoardAnswers, AWWebSocket } from "./interfaces.js";
import { default as csvtojson } from "csvtojson"

let log : any[] = [];

const newPlayerObj = () => {
  let player: Player = {
    playerName: "",
    readyStatus: false,
    answeredStatus: false,
    answers: [],
    wageredStatus: false,
    points: 5,
    exactCorrectAnswers: 0,
    correctAnswers: 0,
    mostPointsEarnedRound: 0,
    highestOddsWon: "",
  };
  return player
};

const newGameObj = (hostPlayerId: number) => {
  let game: Game = {
    hostPlayerId,
    playerIds: [],
    playersReady: false,
    playersAnswered: false,
    state: "preGameLobby",
    hasProcessedAnswers: false,
    processedAnswers: [],
    questions: [],
    questionIndex: 0,
  };
  return game
};

const generateId = () => {
  let Id : string = String(Math.floor(Math.random() * 10));

  for (let i = 0; i < 5; i++) {
    Id += String(Math.floor(Math.random() * 10));
  }

  return Number(Id);
};

const updateAllPlayersReadyStatus = () => {
  for (const gameId in aw.games) {
    //get game from id
    const GAME = aw.games[gameId];
    //check if all players are ready
    GAME.playersReady = GAME.playerIds.every(
      (playerId) => aw.players[playerId].readyStatus
    );
  }
};

const updateAllPlayersAnsweredStatus = () => {
  for (const gameId in aw.games) {
    //get game from id
    const GAME = aw.games[gameId];
    //check if all players have answered
    GAME.playersAnswered = GAME.playerIds.every(
      (playerId) => aw.players[playerId].answeredStatus
    );
  }
};

const getAnswers = (gameId : number) => {
  const QUESTIONINDEX = Number(aw.games[gameId].questionIndex);

  let answers : Answers = [];

  for (const playerId of aw.games[gameId].playerIds) {
    const PLAYERANSWER : Answer ={ answer: aw.players[playerId].answers[QUESTIONINDEX].answer, answerType: '' };//aw.players[playerId].answers[QUESTIONINDEX].answer, answerType: '' };

    //if answer already exists, skip over it - to avoid duplicates

    let answersAry = Object.values(answers);
    if (answersAry.includes(PLAYERANSWER)) {
      continue;
    }

    //add to processed answers
    answers[playerId]= PLAYERANSWER;
  }

  let answersAry = Object.values(answers);

  //sort from lowest to highest
  answersAry.sort((a , b) => {return Number(a.answer) - Number(b.answer)});

  let sortedAnswers : Answers = [];

  for (let index = 0; index < answersAry.length; index++) {
    sortedAnswers[index] = answersAry[index];
  }

  debug(sortedAnswers)
  return sortedAnswers;
};

const getPlayerList = (gameId : number) => {
  let players : Players = {};
  for (const playerId of aw.games[gameId].playerIds) {
    players[playerId] = aw.players[playerId]
  }
  return players
}

const processAnswers = (answers : Answers) => {
  let boardAnswers: BoardAnswers = [];
  debug(answers)
  for (let index : number = 0; index < Object.keys(answers).length; index++) {
    boardAnswers[index] = {
      answer: answers[index].answer,
      odds: '0',
    }
    
  }

  const MIDDLEANSWERINDEX = getMiddleIndex(boardAnswers);

  for (let index : number = 0; index < Object.keys(boardAnswers).length; index++) {
    if (index < MIDDLEANSWERINDEX) {
      const oddsnum = Math.abs(index - 2 - MIDDLEANSWERINDEX);
      boardAnswers[index].odds = oddsnum + "/1";
    }

    if (index == MIDDLEANSWERINDEX) {
      boardAnswers[index].odds = "2/1";
    }

    if (index > MIDDLEANSWERINDEX) {
      const oddsnum = index + 2 - MIDDLEANSWERINDEX;
      boardAnswers[index].odds = oddsnum + "/1";
    }
  }
  return boardAnswers;
};

const getMiddleIndex = (answers : BoardAnswers) => {
  return Object.keys(answers).length !== 1 ? Math.floor((Object.keys(answers).length - 1) / 2) : 1;
};

const getHighestOdds = (answers : BoardAnswers) => {
  return Object.keys(answers).length !== 1 ? getMiddleIndex(answers) + 3 : 2;
};

const getCurrentTime = () => {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
};

const isHost = (playerId : number, gameObj : Game) => {
  return playerId == gameObj.hostPlayerId;
};

const CSVToJSON = (csv : string) => {
  
      try {
          const jsonObject: any = csvtojson().fromFile(csv);
          return jsonObject;
      } catch (err) {
          debug(err)
      }
  
};

const getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4();
};

const debug = (msg : any) => {
  log.push(msg);
  writeLog();
};

const writeLog = () => {

  process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
  console.clear();

  appendStatsToLog();
  
  for (const line of log) {
    console.log(line);
  }
}

const appendStatsToLog = () => {
 
  if (log.length != 0) log.splice(0,8);
  let newLog : any[] = [];
  newLog.push("░█▀█░█▀█░█▀▀░█░█░█▀▀░█▀▄░░░█░█░█▀█░█▀▀░█▀▀░█▀▄");
  newLog.push("░█▀█░█░█░▀▀█░█▄█░█▀▀░█▀▄░░░█▄█░█▀█░█░█░█▀▀░█▀▄");
  newLog.push("░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀░▀░▀░░░▀░▀░▀░▀░▀▀▀░▀▀▀░▀░▀");
  newLog.push("server running at http://localhost:3000");
  newLog.push("");
  newLog.push(`PLAYERS: ${Object.keys(aw.players).length}`);
  //log.push(aw.players);
  newLog.push(`GAMES: ${Object.keys(aw.games).length}`);
  newLog.push("==========================");
  //console.log(aw.games);
  // if (Object.keys(aw.games).length !== 0)
  //   console.log(aw.games[Object.keys(aw.games)[0]].processedAnswers);
    for (const line of log) {
      newLog.push(line)
    }
    log = newLog;
    
  };

const boolConv = (boolStr : string) => {
  if (boolStr === "true") {
    return true;
  }
  if (boolStr === "false") {
    return false;
  }
  return false;
};

export {
  generateId,
  updateAllPlayersReadyStatus,
  getCurrentTime,
  appendStatsToLog as drawDebug,
  boolConv,
  newPlayerObj,
  newGameObj,
  updateAllPlayersAnsweredStatus,
  processAnswers,
  getAnswers,
  getMiddleIndex,
  getHighestOdds,
  isHost,
  CSVToJSON,
  getUniqueID,
  debug,
  writeLog,
  appendStatsToLog,
  getPlayerList
};
