import { connectRoute } from "./handlers/connection/connect-route";
import { disconnectHostLeaves } from "./handlers/connection/disconnect-host-leaves";
import { createGame } from "./handlers/games/create-game";
import { updateLobby } from "./handlers/games/update-lobby";
import { joinGame } from "./handlers/games/join-game";
import { checkAnsweredStatus } from "./handlers/games/answered-status";
import { checkReadyStatus } from "./handlers/games/ready-status";
import { showQuestion } from "./handlers/games/show-question";
import { submitAnswer } from "./handlers/games/submit-answer";
import { submitBet } from "./handlers/games/submit-bet";
import { leaveGame } from "./handlers/games/leave-game";
import { loadQuestions } from "./handlers/games/load-questions";
import { getGameRules } from "./handlers/games/game-rules";
import { updatePlayer } from "./handlers/players/update-player";
import { checkWageredStatus } from "./handlers/games/wagered-status";
import { startGame } from "./handlers/games/start-game";
import { checkRevealedStatus } from "./handlers/games/revealed-status";

import * as utils from "./utils.js";
import { debug } from "./utils.js";
import multer from "multer";

import express from "express";
import { newViewData } from "./store/viewdata";

const router = express.Router();
const upload = multer({ dest: "./uploads" }).single("file");

router.use((req: express.Request, res: express.Response, next: Function) => {
  next();
  utils.writeLog();
});

router.get("/", (req: express.Request, res: express.Response) => {
  res.render("base", newViewData(Number(req.query.playerId)));
});

router.get(
  "/connect/:playerId",
  (req: express.Request, res: express.Response) => {
    connectRoute(req, res);
  }
);

router.get(
  "/games/:playerId/create",
  (req: express.Request, res: express.Response) => {
    createGame(req, res);
  }
);

router.get("/games/join", (req: express.Request, res: express.Response) => {
  joinGame(req, res);
});

router.get(
  "/games/:gameId/updatelobby",
  (req: express.Request, res: express.Response) => {
    updateLobby(req, res);
  }
);

router.post(
  "/games/:gameId/loadquestions",
  function (req: express.Request, res: express.Response) {
    upload(req, res, function (err) {
      if (err) {
        debug(err);
        return res.status(400).send("a error occured uploading the file");
      }
      loadQuestions(req, res);
    });
  }
);

router.get(
  "/games/:gameId/disconnect",
  (req: express.Request, res: express.Response) => {
    disconnectHostLeaves(req, res);
  }
);

router.get(
  "/games/:gameId/leave",
  (req: express.Request, res: express.Response) => {
    leaveGame(req, res);
  }
);

router.get(
  "/games/:gameId/submitanswer",
  (req: express.Request, res: express.Response) => {
    submitAnswer(req, res);
  }
);

router.get(
  "/games/:gameId/submitbet",
  (req: express.Request, res: express.Response) => {
    submitBet(req, res);
  }
);

router.get(
  "/games/:gameId/start",
  (req: express.Request, res: express.Response) => {
    startGame(req, res);
  }
);

router.get(
  "/games/:gameId/showquestion",
  (req: express.Request, res: express.Response) => {
    showQuestion(req, res);
  }
);

router.get(
  "/games/:gameId/readycheck",
  (req: express.Request, res: express.Response) => {
    checkReadyStatus(req, res);
  }
);

router.get(
  "/games/:gameId/answercheck",
  (req: express.Request, res: express.Response) => {
    checkAnsweredStatus(req, res);
  }
);

router.get(
  "/games/:gameId/wageredcheck",
  (req: express.Request, res: express.Response) => {
    checkWageredStatus(req, res);
  }
);

router.get(
  "/games/:gameId/scores",
  (req: express.Request, res: express.Response) => {
    checkRevealedStatus(req, res);
  }
);

router.get(
  "/game-rules/:playerId",
  (req: express.Request, res: express.Response) => {
    getGameRules(req, res);
  }
);

router.get(
  "/players/:playerId/update",
  (req: express.Request, res: express.Response) => {
    updatePlayer(req, res);
  }
);

export default router;
