import express from "express";
import { gameStore } from "../../server";
import { BoardAnswer } from "../../store/answers";
import { getHighestOdds } from "../../utils";

const checkAnsweredStatus = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const GAME = gameStore.Games[GAMEID];
    const PLAYERID = Number(req.query.playerId);
    GAME.UpdateAnsweredStatus();

    if (GAME.PlayersAnswered()) {
 

        GAME.ProcessAnswers()

        gameStore.Games[GAMEID].hasProcessedAnswers = true;
  
     //render wager board
      res.render("wager-board", {
        answers: GAME.processedAnswers,
        highestodds: getHighestOdds(GAME.processedAnswers),
        playerId: PLAYERID,
        gameId: GAMEID,
        playerList: GAME.GetPlayerList(),
      });
  
      return;
    }

  //send empty response if all players haven't submitted an answer
  res.sendStatus(204);

  //utils.drawDebug();
};

export { checkAnsweredStatus }