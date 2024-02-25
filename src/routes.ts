import { connectRoute } from "./handlers/connection/get-connect-route";
import { disconnectHostLeaves } from "./handlers/connection/get-disconnect-host-leaves";
import { createGame } from "./handlers/games/post-create-game";
import { getPlayerList } from "./handlers/games/get-player-list";
import { joinGame } from "./handlers/games/put-join-game";
import { checkAnsweredStatus } from "./handlers/games/get-answered-status";
import { checkReadyStatus } from "./handlers/games/get-ready-status";
import { showQuestion } from "./handlers/games/get-show-question";
import { submitAnswer } from "./handlers/games/post-submit-answer";
import { submitBet } from "./handlers/games/post-submit-bet";
import { leaveGame } from "./handlers/games/put-leave-game";
import { loadQuestions } from "./handlers/games/post-load-questions";
import { getGameRules } from "./handlers/games/get-game-rules";
import { updatePlayer } from "./handlers/players/put-update-player";
 

import * as utils from "./utils.js";
import {debug} from "./utils.js"
import multer from "multer";

import express from "express";

const router = express.Router();
const upload = multer({ dest: "./uploads" }).single("file");


router.use((req : express.Request, res : express.Response, next : Function) => {
  next();
  //utils.writeLog();
});

router.get("/", (req : express.Request, res :  express.Response) => {
  res.render("base");
});

router.get("/connect", (req : express.Request, res : express.Response) => {
  debug(req.query)
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
  "/games/:gameId/loadquestions",function (req : express.Request, res : express.Response) {
    upload(req,res,function(err) {
      if (err) {
        debug(err);
        return res.status(400).send("a error occured uploading the file");
      }
      loadQuestions(req, res);
    }
  
)

});

router.get("/games/disconnect", (req : express.Request, res : express.Response) => {
  disconnectHostLeaves(req, res);
});

router.get("/games/:gameId/leave", (req : express.Request, res : express.Response) => {
  leaveGame(req, res);
});

router.get("/games/:gameId/submitanswer", (req : express.Request, res : express.Response) => {
  submitAnswer(req, res);
});

router.get("/games/:gameId/submitbet", (req : express.Request, res : express.Response) => {
  submitBet(req,res)
})

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
