//LOCAL IMPORTS
const aw = require("./index.js");
const handlers = require("./handlers.js");
const utils = require("./utils.js");

//ROUTES

aw.app.get("/", (req, res) => {
  res.render("start-page", { playerName: "John" });
});

aw.app.get("/connect", (req, res) => {
  handlers.connectRoute(req, res);
});

aw.app.get("/games/create", (req, res) => {
  handlers.createGame(req, res);
});

aw.app.get("/games/join", (req, res) => {
  handlers.joinGame(req, res);
});

aw.app.get("/games/:gameId/playerlist", (req, res) => {
  handlers.getPlayerList(req, res);
});

aw.app.get("/games/disconnect", (req, res) => {
  handlers.disconnectHostLeaves(req, res);
});

aw.app.get("/games/:gameId/leave", (req, res) => {
  handlers.leaveGame(req, res);
});

aw.app.get("/games/:gameId/submitanswer", (req, res) => {
  handlers.submitAnswer(req, res);
});

aw.app.get("/games/:gameId/start", (req, res) => {
  handlers.showQuestion(req, res);
});

aw.app.get("/games/:gameId/readycheck", (req, res) => {
  handlers.checkReadyStatus(req, res);
});

aw.app.get("/games/:gameId/answercheck", (req, res) => {
  handlers.checkAnsweredStatus(req, res);
});

aw.app.get("/game-rules", (req, res) => {
  handlers.getGameRules(req, res);
});

aw.app.get("/players/:playerId/update", (req, res) => {
  handlers.updatePlayer(req, res);
});
