// //EXTRAS
// const { join } = require("node:path");
// const fs = require("fs");

// //EXPRESS & SOCKET.IO SETUP

// const { createServer } = require("node:http");
// const express = require("express");
// const { Server } = require("socket.io");

// const app = express();
// const server = createServer(app);
// const io = new Server(server);

// //LIVE RELOAD SETUP

// const livereload = require("livereload");

// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(join(__dirname, "public"));
// const connectLivereload = require("connect-livereload");

// //SET EXPRESS VALS

// app.set("view engine", "pug");
// app.use(connectLivereload());

// app.use(express.static("public"));
// app.use(express.static("lib"));
// app.set("views", "./views");

// //VARS
// var games = {};
// var players = {};

// //VAR EXPORTS
// exports.games = games;
// exports.players = players;
// exports.app = app;
// exports.server = server;
// exports.io = io;

// //LOCAL REQUIRES

// const routes = require("./routes.js");
// const utils = require("./utils.js");
// const handlers = require("./handlers.js");

// //EXPRESS SERVER LISTEN

// server.listen(3000, () => {
//   utils.drawDebug();
// });

// //SOCKET.IO LISTEN

// io.on("connection", (socket) => {
//   handlers.connect(socket.id);

//   socket.on("disconnect", () => {
//     handlers.disconnect(socket.id);
//   });
// });

// //LIVE RELOAD LISTEN

// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

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
  console.log("New connection!", ws.id);

  ws.send(
    '<input class="player-id" id="playerId" name="playerId" value="' +
      ws.id +
      '">'
  );
  console.log("SENT");

  ws.on("close", function close() {
    disconnect(ws.id);
    console.log("Disconnected!", ws.id);
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
