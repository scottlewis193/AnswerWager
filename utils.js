// import the necessary functions and objects
import * as aw from "./app.js";

//FUNCTIONS

const newPlayerObj = () => {
  return {
    playerName: "",
    readyStatus: false,
    answeredStatus: false,
    answers: {},
    wageredStatus: false,
    points: 0,
    exactCorrectAnswers: 0,
    correctAnswers: 0,
    mostPointsEarnedRound: 0,
    highestOddsWon: "",
  };
};

const newGameObj = (hostPlayerId) => {
  return {
    hostPlayerId,
    playerIds: [],
    playersReady: false,
    playersAnswered: false,
    state: "preGameLobby",
    processedAnswers: {},
    questions: {
      0: {
        question: "Test Question?",
        imageURL:
          "https://www.thewowstyle.com/wp-content/uploads/2015/04/cat1.jpg",
        answerType: "integer",
        answer: 1,
      },
    },
    questionIndex: 0,
  };
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

const getAnswers = (gameId) => {
  const QUESTIONINDEX = String(aw.games[gameId].questionIndex);

  let answers = [];
  for (const playerId of aw.games[gameId].playerIds) {
    const PLAYERANSWER = aw.players[playerId].answers[QUESTIONINDEX].answer;

    //if answer already exists, skip over it - to avoid duplicates
    if (answers.includes(PLAYERANSWER)) {
      continue;
    }

    //add to processed answers
    answers.push(PLAYERANSWER);
  }

  //sort from lowest to highest
  answers.sort((a, b) => a - b);

  return answers;
};

const processAnswers = (answersAry) => {
  let answersObjAry = [];

  for (const answer of answersAry) {
    answersObjAry.push({ answer: answer, odds: 0 });
  }

  const MIDDLEANSWERINDEX = getMiddleIndex(answersObjAry);

  for (let index = 0; index < answersObjAry.length; index++) {
    if (index < MIDDLEANSWERINDEX) {
      const oddsnum = Math.abs(index - 2 - MIDDLEANSWERINDEX);
      answersObjAry[index].odds = oddsnum + "/1";
    }

    if (index == MIDDLEANSWERINDEX) {
      answersObjAry[index].odds = "2/1";
    }

    if (index > MIDDLEANSWERINDEX) {
      const oddsnum = index + 2 - MIDDLEANSWERINDEX;
      answersObjAry[index].odds = oddsnum + "/1";
    }
  }

  return answersObjAry;
};

const getMiddleIndex = (array) => {
  return array.length !== 1 ? Math.floor((array.length - 1) / 2) : 1;
};

const getHighestOdds = (answersObjAry) => {
  return answersObjAry.length !== 1 ? getMiddleIndex(answersObjAry) + 3 : 2;
};

const getCurrentTime = () => {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
};

const isHost = (playerId, gameObj) => {
  return playerId == gameObj.hostPlayerId;
};

const CSVToJSON = (csv) => {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
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

const boolConv = (boolStr) => {
  if (boolStr === "true") {
    return true;
  }
  if (boolStr === "false") {
    return false;
  }
  return boolStr;
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
};
