import { join } from "node:path";
import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import * as utils from "./utils.js";
import { default as router } from "./routes.js";
import { connect, disconnect } from "./handlers.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const __dirname = import.meta.dirname;
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(join(__dirname, "public"));

app.set("view engine", "pug");
app.use(connectLivereload());
app.use(express.static("public"));
app.use(express.static("lib"));
app.set("views", "./views");
app.use("/", router);

let games = {};
let players = {};

wss.on("connection", function connection(ws) {
  ws.id = wss.getUniqueID();
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

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

server.listen(3000, function listening() {
  utils.drawDebug();
});

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

export { games, players, app };
