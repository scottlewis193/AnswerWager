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
import { connect } from "./handlers/connection/get-connect.js";
import { disconnect } from "./handlers/connection/get-disconnect.js";

import { fileURLToPath } from "url";
import pug from "pug";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.static("lib"));
app.set("views", "./views");
app.use("/", router);

//stores
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

wss.on("connection", function connection(ws: AWWebSocket) {
  ws.id = utils.generateId();
  connect(ws.id);

  ws.send(`<div class='page start-page' id='start-page' name='start-page' hx-vals='{"playerId": "${ws.id}"}' hx-include='[name="playerName"]' hx-target='.content'>
  <input id='name-input' class='menu-input' name='playerName' value='' placeholder='Enter Name'>
  <button id='connect' class='menu-button' hx-get='/connect/${ws.id}'>Confirm</button></div>`);

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
