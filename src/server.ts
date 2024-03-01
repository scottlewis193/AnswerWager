import { join } from "node:path";
import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import * as utils from "./utils.js";
import { default as router } from "./routes.js";
import fs from "fs";
import path from "path";
import { NewPlayerStore, PlayerStore } from "./store/players.js";
import { NewGameStore } from "./store/games.js";
import { AWWebSocket } from "./store/store.js";
import { connect } from "./handlers/connection/get-connect.js"
import { disconnect } from "./handlers/connection/get-disconnect.js"

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
const gameStore = NewGameStore()
const playerStore = NewPlayerStore()

wss.on("connection", function connection(ws : AWWebSocket) {
  ws.id = utils.generateId();
  connect(ws.id);

  ws.send(
    '<input class="player-id" id="playerId" name="playerId" value="' +
      ws.id +
      '">'
  );

  ws.on("close", function close() {
    disconnect(ws.id);

  });

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
      utils.debug('player-list request received')
      ws.send(`<div id="player-list">TEST</div>`);
    }
    
  );

});


server.listen(3000, function listening() {
  utils.appendStatsToLog();

  //delete uploads
  fs.rmSync("./uploads", { recursive: true });
   fs.mkdirSync("./uploads", { recursive: true });
});



export { gameStore, playerStore, app, wss };


