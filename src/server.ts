import { join } from "node:path";
import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import * as utils from "./utils.js";
import { default as router } from "./routes.js";
import fs from "fs";
import path from "path";
import { newPlayerStore } from "./store/players.js";
import { newGameStore } from "./store/games.js";
import { AWWebSocket } from "./store/store.js";
import { connect } from "./handlers/connection/connect.js";
import { disconnect } from "./handlers/connection/get-disconnect.js";
import { config } from "dotenv";

import { fileURLToPath } from "url";

//initialise express
const app = express();
//initialise websocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
//create path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//set view engine to pug
app.set("view engine", "pug");

//set static folders
app.use(express.static("public"));
app.use(express.static("lib"));

//set views folder
app.set("views", "./views");

//DO NOT CHANGE ORDER OF THESE - REQUIRED FOR BODY TO BE DEFINED WHEN REQUESTED
//set body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//setup routes
app.use("/", router);

//init stores
const GAMESTORE = newGameStore();
const PLAYERSTORE = newPlayerStore();

const GAMESTATES = [
  "PreGameLobby",
  "Question",
  "Wagering",
  "AnswerReveal",
  "Scores",
  "FinalScores",
];

//load env variables
config({ path: join(__dirname, "..", ".env") });

wss.on("connection", function connection(ws: AWWebSocket) {
  ws.id = utils.generateId();
  connect(ws.id);

  ws.send(`
  <form class='page start-page' id='start-page' name='start-page' hx-vals='{"playerId": "${ws.id}"}' hx-include='[name="playerName"]' hx-target='.content'>
  <input id='name-input' class='menu-input' name='playerName' value='' placeholder='Enter Name'>
  <button hx-put='/connect'>Confirm</button></form>`);

  ws.on("close", function close() {
    disconnect(ws.id);
  });
});

server.listen(3000, function listening() {
  utils.appendStatsToLog();

  //delete uploads
  fs.rmSync("./uploads", { recursive: true });
  fs.mkdirSync("./uploads", { recursive: true });
});

export { GAMESTORE, PLAYERSTORE, GAMESTATES, app, wss };
