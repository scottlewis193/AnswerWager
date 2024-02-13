//EXTRAS
const { join } = require("node:path");
const fs = require("fs");

//EXPRESS & SOCKET.IO SETUP

const { createServer } = require("node:http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

//LIVE RELOAD SETUP

const livereload = require("livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(join(__dirname, "public"));
const connectLivereload = require("connect-livereload");

//SET EXPRESS VALS

app.set("view engine", "pug");
app.use(connectLivereload());

app.use(express.static("public"));
app.use(express.static("lib"));
app.set("views", "./views");

//VARS
var games = {};
var players = {};

//VAR EXPORTS
exports.games = games;
exports.players = players;
exports.app = app;
exports.server = server;
exports.io = io;

//LOCAL REQUIRES

const routes = require("./routes.js");
const utils = require("./utils.js");
const handlers = require("./handlers.js");

//EXPRESS SERVER LISTEN

server.listen(3000, () => {
  utils.drawDebug();
});

//SOCKET.IO LISTEN

io.on("connection", (socket) => {
  handlers.connect(socket.id);

  socket.on("disconnect", () => {
    handlers.disconnect(socket.id);
  });
});

//LIVE RELOAD LISTEN

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
