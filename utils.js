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
    aw.games[gameId].playersAnswered = aw.games[gameId].playerIds.every(
      (playerId) => aw.players[playerId].answeredStatus
    );
  }
};

const processAnswers = (gameId) => {
  const QUESTIONINDEX = String(aw.games[gameId].questionIndex);

  let processedAnswers = [];

  for (const playerId in aw.players) {
    const PLAYERANSWER = aw.players[playerId].answers[QUESTIONINDEX].answer;

    //if answer already exists, skip over it - to avoid duplicates
    if (processedAnswers.includes(PLAYERANSWER)) {
      continue;
    }

    //add to processed answers
    processedAnswers.push({ answer: PLAYERANSWER, odds: "" });
  }

  //sort from lowest to highest
  processedAnswers.sort((a, b) => a.answer - b.answer);

  const MIDDLEANSWERINDEX =
    processedAnswers.length !== 1 ? (processedAnswers.length - 1) / 2 : 1;
  const HIGHESTODDS = processedAnswers.length !== 1 ? MIDDLEANSWERINDEX + 1 : 2;

  for (let index = 0; index < processedAnswers.length; index++) {
    if (index < MIDDLEANSWERINDEX) {
      processedAnswers[index].odds = HIGHESTODDS - index + "/1";
    }

    if (index == MIDDLEANSWERINDEX) {
      processedAnswers[index].odds = "2/1";
    }

    if (index > MIDDLEANSWERINDEX) {
      processedAnswers[index].odds = index - HIGHESTODDS + "/1";
    }
  }

  return processedAnswers;
};

const getCurrentTime = () => {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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
};
