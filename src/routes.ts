import { connectRoute } from "./handlers/connection/connect-route";
import { disconnectHostLeaves } from "./handlers/connection/disconnect-host-leaves";
import { createGame } from "./handlers/games/create-game";
import { updateGameUIState } from "./handlers/games/update-game-ui-state";
import { joinGame } from "./handlers/games/join-game";
import { leaveGame } from "./handlers/games/leave-game";
import { loadQuestions } from "./handlers/games/load-questions";
import { getGameRules } from "./handlers/other/game-rules";
import { updatePlayer } from "./handlers/players/update-player";
import { startGame } from "./handlers/games/start-game";

import * as utils from "./utils.js";
import { debug } from "./utils.js";
import multer from "multer";

import express from "express";
import { newViewData } from "./store/viewdata";
import { PLAYERSTORE } from "./server";
import { updateGame } from "./handlers/games/update-game";

const router = express.Router();
const upload = multer({ dest: "./uploads" }).single("file");

router.use((req: express.Request, res: express.Response, next: Function) => {
  next();
  utils.writeLog();
});

router.get("/", (req: express.Request, res: express.Response) => {
  //const NEWID = PLAYERSTORE.getNextId();
  //PLAYERSTORE.createPlayer(NEWID);
  res.render("base", newViewData(Number(req.query.playerId)));
});

router.put("/connect", (req: express.Request, res: express.Response) => {
  connectRoute(req, res);
});

router.post("/games", async (req: express.Request, res: express.Response) => {
  createGame(req, res);
});

router.put("/games/join", (req: express.Request, res: express.Response) => {
  joinGame(req, res);
});

router.put("/games/:gameId", (req: express.Request, res: express.Response) => {
  updateGame(req, res);
});

router.put(
  "/games/:gameId/leave",
  (req: express.Request, res: express.Response) => {
    leaveGame(req, res);
  }
);

router.put(
  "/games/:gameId/uistate",
  (req: express.Request, res: express.Response) => {
    updateGameUIState(req, res);
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

router.put(
  "/games/:gameId/start",
  (req: express.Request, res: express.Response) => {
    startGame(req, res);
  }
);

router.get(
  "/game-rules/:playerId",
  (req: express.Request, res: express.Response) => {
    getGameRules(req, res);
  }
);

router.put(
  "/players/:playerId",
  (req: express.Request, res: express.Response) => {
    updatePlayer(req, res);
  }
);

export default router;
