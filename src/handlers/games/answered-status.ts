import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { BoardAnswer } from "../../store/answers";
import { debug } from "../../utils";
import { newViewData } from "../../store/viewdata";

const checkAnsweredStatus = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];

  GAME.updateAnsweredStatus();

  if (GAME.playersHaveAnswered()) {
    debug(
      `${GAME.gameId}: all players have answered question ${GAME.questionIndex}`
    );
    GAME.processAnswers();

    GAME.hasProcessedAnswers = true;

    GAME.updateGameState();

    //render wager board
    res.render("wager-board", newViewData(PLAYER.playerId, GAME.gameId));

    return;
  }

  //send empty response if all players haven't submitted an answer
  res.sendStatus(204);
};

export { checkAnsweredStatus };
