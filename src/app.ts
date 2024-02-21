import { join } from "node:path";
import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import * as utils from "./utils.js";
import { default as router } from "./routes.js";
import { connect, disconnect } from "./handlers.js";
import { Games, Players, AWWebSocket } from "./interfaces";
import { getUniqueID } from "./utils.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(join(__dirname, "public"));

app.set("view engine", "pug");
app.use(connectLivereload());
app.use(express.static("public"));
app.use(express.static("lib"));
app.set("views", "./views");
app.use("/", router);

let games : Games = {};
let players : Players = {};

wss.on("connection", function connection(ws : AWWebSocket) {
  ws.id = getUniqueID();
  connect(ws.id);

  ws.send(
    '<input class="player-id" id="playerId" name="playerId" value="' +
      ws.id +
      '">'
  );

  ws.on("close", function close() {
    disconnect(ws.id);
  });
});


server.listen(3000, function listening() {
  utils.drawDebug();

  //delete uploads
  fs.rmSync("./uploads", { recursive: true });
   fs.mkdirSync("./uploads", { recursive: true });
});

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

export { games, players, app };
