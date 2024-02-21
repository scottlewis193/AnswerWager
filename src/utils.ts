// import the necessary functions and objects
import * as aw from "./app.js";
import WebSocket, { WebSocketServer } from "ws";
import { Player, Game, Players, Games, Answer, Answers, Question, Questions, BoardAnswer, BoardAnswers, AWWebSocket } from "./interfaces.js";

const newPlayerObj = () => {
  let player: Player = {
    playerName: "",
    readyStatus: false,
    answeredStatus: false,
    answers: [],
    wageredStatus: false,
    points: 0,
    exactCorrectAnswers: 0,
    correctAnswers: 0,
    mostPointsEarnedRound: 0,
    highestOddsWon: "",
  };
  return player
};

const newGameObj = (hostPlayerId: string) => {
  let game: Game = {
    hostPlayerId,
    playerIds: [],
    playersReady: false,
    playersAnswered: false,
    state: "preGameLobby",
    processedAnswers: [],
    questions: [],
    questionIndex: 0,
  };
  return game
};

const generateGameId = () => {
  let gameId = String(Math.floor(Math.random() * 10));

  for (let i = 0; i < 5; i++) {
    gameId += String(Math.floor(Math.random() * 10));
  }

  return gameId;
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

const getAnswers = (gameId : string) => {
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
    answers.push(PLAYERANSWER);
  }

  //sort from lowest to highest
  answers.sort((a , b) => Number(a.answer) - Number(b.answer));

  return answers;
};

const processAnswers = (answers : Answers) => {
  let boardAnswers: BoardAnswers = [];

  for (const answer of answers) {
    boardAnswers.push({
      answer: answer.answer,
      odds: '0',
    })
  }

  const MIDDLEANSWERINDEX = getMiddleIndex(boardAnswers);

  for (let index : number = 0; index < boardAnswers.length; index++) {
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
  return answers.length !== 1 ? Math.floor((answers.length - 1) / 2) : 1;
};

const getHighestOdds = (answers : BoardAnswers) => {
  return answers.length !== 1 ? getMiddleIndex(answers) + 3 : 2;
};

const getCurrentTime = () => {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
};

const isHost = (playerId : string, gameObj : Game) => {
  return playerId == gameObj.hostPlayerId;
};

const CSVToJSON = (csv : string) => {
  const lines = csv.split("\n");
  const result : Questions = [];
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    
    const currentline = lines[i].split(",");
    let question: Question = {
      question: "",
      imageURL: "",
      answerType: "",
      answer: "",
      gameId: "",
      playerId: "",
    };
    for (let j = 0; j < headers.length; j++) {
      Object.keys(question)[j] = currentline[j];
    }

    result.push(question);
  }
  return result;
};

const getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

const drawDebug = () => {
  process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
  console.clear();
  console.log("░█▀█░█▀█░█▀▀░█░█░█▀▀░█▀▄░░░█░█░█▀█░█▀▀░█▀▀░█▀▄");
  console.log("░█▀█░█░█░▀▀█░█▄█░█▀▀░█▀▄░░░█▄█░█▀█░█░█░█▀▀░█▀▄");
  console.log("░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀░▀░▀░░░▀░▀░▀░▀░▀▀▀░▀▀▀░▀░▀");
  console.log("server running at http://localhost:3000");
  console.log("");
  console.log(`PLAYERS: ${Object.keys(aw.players).length}`);
  console.log(aw.players);

  console.log(`GAMES: ${Object.keys(aw.games).length}`);
  console.log(aw.games);
  if (Object.keys(aw.games).length !== 0)
    console.log(aw.games[Object.keys(aw.games)[0]].processedAnswers);
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
  generateGameId,
  updateAllPlayersReadyStatus,
  getCurrentTime,
  drawDebug,
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
};
