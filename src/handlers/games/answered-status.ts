import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { BoardAnswer } from "../../store/answers";
import { getHighestOdds, debug } from "../../utils";

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
    res.render("wager-board", {
      playerBetAnswers: PLAYER.getBetAnswers(),
      player: PLAYER,
      answers: GAME.processedAnswers,
      highestodds: getHighestOdds(GAME.processedAnswers),
      playerId: PLAYER.playerId,
      gameId: GAME.gameId,
      players: GAME.getPlayers(),
      btnsDisabled: false,
    });

    return;
  }

  //send empty response if all players haven't submitted an answer
  res.sendStatus(204);
};

export { checkAnsweredStatus };
