import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import * as utils from "./utils.js";
import { default as router } from "./routes.js";
import { connect, disconnect } from "./handlers.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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
let games = {};
let players = {};
wss.on("connection", function connection(ws) {
    ws.id = utils.generateId();
    connect(ws.id);
    ws.send('<input class="player-id" id="playerId" name="playerId" value="' +
        ws.id +
        '">');
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
export { games, players, app };
