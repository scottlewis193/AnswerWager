import express from "express";
import { GAMESTORE } from "../../server";
import { debug } from "../../utils";
import { newViewData } from "../../store/viewdata";

const checkReadyStatus = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYERID = Number(req.query.playerId);
  const QUESTIONINDEX = GAME.questionIndex;

  GAME.updateReadyStatus();

  //if player is host then show start button

  res.render("start-btn", newViewData(PLAYERID, GAME.gameId));

  //if all players are ready and game has started then show question
  if (GAME.getGameState() == "Question" && GAME.playersReady) {
    debug(`${GAME.gameId}: game has started`);

    let questionObj = GAME.questions[QUESTIONINDEX];
    questionObj.gameId = GAME.gameId;
    questionObj.playerId = PLAYERID;
    //add HX-Retarget to question so replaces the contents of the center div
    res.set("HX-Retarget", ".content");
    res.render("question", newViewData(PLAYERID, GAME.gameId));
    return;
  }

  //send empty response if all players aren't ready or game hasn't started
  res.sendStatus(204);
};

export { checkReadyStatus };
