import express from "express";
import { gameStore, playerStore } from "../../server";
import { BoardAnswer } from "../../store/answers";
import { getHighestOdds, debug } from "../../utils";


const checkAnsweredStatus = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.params.gameId)];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];

    GAME.UpdateAnsweredStatus();

    if (GAME.PlayersAnswered()) {
 
        debug(`${GAME.gameId}: all players have answered question ${GAME.questionIndex}`);
        GAME.ProcessAnswers()

        GAME.hasProcessedAnswers = true;

     //render wager board
      res.render("wager-board", {
        playerBetAnswers: PLAYER.GetBetAnswers(),
        player: PLAYER,
        answers: GAME.processedAnswers,
        highestodds: getHighestOdds(GAME.processedAnswers),
        playerId: PLAYER.playerId,
        gameId: GAME.gameId,
        playerList: GAME.GetPlayerList(),
        btnsDisabled: false
      });
  
      return;
    }

  //send empty response if all players haven't submitted an answer
  res.sendStatus(204);

};

export { checkAnsweredStatus }