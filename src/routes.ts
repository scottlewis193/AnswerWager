import {
  connectRoute,
  createGame,
  joinGame,
  getPlayerList,
  leaveGame,
  submitAnswer,
  showQuestion,
  disconnectHostLeaves,
  checkReadyStatus,
  checkAnsweredStatus,
  getGameRules,
  updatePlayer,
  loadQuestions,
} from "./handlers.js";

import * as utils from "./utils.js";
import multer from "multer";

import express from "express";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.use((req : express.Request, res : express.Response, next : Function) => {
  next();
  utils.drawDebug();
});

router.get("/", (req : express.Request, res :  express.Response) => {
  res.render("start-page");
});

router.get("/connect", (req : express.Request, res : express.Response) => {
  connectRoute(req, res);
});

router.get("/games/create", (req : express.Request, res : express.Response) => {
  createGame(req, res);
});

router.get("/games/join", (req : express.Request, res : express.Response) => {
  joinGame(req, res);
});

router.get("/games/:gameId/playerlist", (req : express.Request, res : express.Response) => {
  getPlayerList(req, res);
});

router.post(
  "/games/:gameId/loadquestions",
  upload.single("file"),
  (req : express.Request, res : express.Response) => {
    const file = req.file;
    console.log(file);
    loadQuestions(req, res);
  }
);

router.get("/games/disconnect", (req : express.Request, res : express.Response) => {
  disconnectHostLeaves(req, res);
});

router.get("/games/:gameId/leave", (req : express.Request, res : express.Response) => {
  leaveGame(req, res);
});

router.get("/games/:gameId/submitanswer", (req : express.Request, res : express.Response) => {
  submitAnswer(req, res);
});

router.get("/games/:gameId/start", (req : express.Request, res : express.Response) => {
  showQuestion(req, res);
});

router.get("/games/:gameId/readycheck", (req : express.Request, res : express.Response) => {
  checkReadyStatus(req, res);
});

router.get("/games/:gameId/answercheck", (req : express.Request, res : express.Response) => {
  checkAnsweredStatus(req, res);
});

router.get("/game-rules", (req : express.Request, res : express.Response) => {
  getGameRules(req, res);
});

router.get("/players/:playerId/update",(req : express.Request, res : express.Response) => {
  updatePlayer(req, res);
});

export default router;
