// import the necessary functions and objects
import { GAMESTORE, PLAYERSTORE } from "./server.js";
import WebSocket, { WebSocketServer } from "ws";
import { BoardAnswer } from "./store/answers.js";
import { default as csvtojson } from "csvtojson";

let log: any[] = [];

const generateId = () => {
  let Id: string = String(Math.floor(Math.random() * 10));

  for (let i = 0; i < 5; i++) {
    Id += String(Math.floor(Math.random() * 10));
  }

  return Number(Id);
};

const getMiddleIndex = (answers: BoardAnswer[]) => {
  return Object.keys(answers).length !== 1
    ? Math.floor((Object.keys(answers).length - 1) / 2)
    : 1;
};

const getCurrentTime = () => {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
};

const CSVToJSON = (csv: string) => {
  try {
    const jsonObject: any = csvtojson().fromFile(csv);
    return jsonObject;
  } catch (err) {
    debug(err);
  }
};

const debug = (msg: any, ...optionalParams: any[]) => {
  if (log.includes(msg, ...optionalParams)) {
    return;
  }
  log.push(`[${getCurrentTime()}] ` + msg, ...optionalParams);
  writeLog();
};

const writeLog = () => {
  process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
  console.clear();

  appendStatsToLog();

  for (const line of log) {
    console.log(line);
  }
};

const appendStatsToLog = () => {
  if (log.length != 0) log.splice(0, 8);
  let newLog: any[] = [];
  newLog.push("░█▀█░█▀█░█▀▀░█░█░█▀▀░█▀▄░░░█░█░█▀█░█▀▀░█▀▀░█▀▄");
  newLog.push("░█▀█░█░█░▀▀█░█▄█░█▀▀░█▀▄░░░█▄█░█▀█░█░█░█▀▀░█▀▄");
  newLog.push("░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀░▀░▀░░░▀░▀░▀░▀░▀▀▀░▀▀▀░▀░▀");
  newLog.push("server running at http://localhost:3000");
  newLog.push("");
  newLog.push(`PLAYERS: ${Object.keys(PLAYERSTORE.Players).length}`);
  //newLog.push(PLAYERSTORE.Players);
  newLog.push(
    `GAMES: ${Object.keys(GAMESTORE.Games).length}` +
      ` ${GAMESTORE.getGameByIndex(0)?.getGameStateStr()} `
  );
  //newLog.push(GAMESTORE.Games);
  newLog.push("==========================");
  // if (Object.keys(aw.games).length !== 0)
  //   console.log(aw.games[Object.keys(aw.games)[0]].processedAnswers);
  for (const line of log) {
    newLog.push(line);
  }
  log = newLog;
};

const boolConv = (boolStr: string) => {
  if (boolStr === "true") {
    return true;
  }
  if (boolStr === "false") {
    return false;
  }
  return false;
};

const findClosestNumber = (numbers: number[], target: number) => {
  let closestNumber = -Infinity; // Initialize with a value that is less than any possible number in the array

  for (const number of numbers) {
    if (number <= target && number > closestNumber) {
      closestNumber = number;
    }
  }

  return closestNumber;
};

const findClosestDate = (dates: Date[], target: Date) => {
  let closestDate = new Date(0); // Initialize with a value that is less than any possible date in the array

  for (const date of dates) {
    if (date <= target && date > closestDate) {
      closestDate = date;
    }
  }

  return closestDate;
};

function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>;
}

export {
  generateId,
  getCurrentTime,
  appendStatsToLog as drawDebug,
  boolConv,
  getMiddleIndex,
  CSVToJSON,
  debug,
  writeLog,
  appendStatsToLog,
  findClosestNumber,
  findClosestDate,
  keys,
};
