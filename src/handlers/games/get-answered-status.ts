import express from "express";
import { gameStore } from "../../server";
import { BoardAnswers } from "../../store/store";

const checkAnsweredStatus = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    gameStore.UpdateAllPlayersAnsweredStatus(GAMEID);
    if (gameStore.PlayersAnswered(GAMEID)) {
      //process answers
      let PROCESSEDANSWERS : BoardAnswers
      // debug(aw.games[GAMEID].processedAnswers)
      // if (aw.games[GAMEID].hasProcessedAnswers) {
      //   PROCESSEDANSWERS = aw.games[GAMEID].processedAnswers
        
      // } else {
        PROCESSEDANSWERS = utils.processAnswers(utils.getAnswers(GAMEID))
        aw.games[GAMEID].hasProcessedAnswers = true;
      // }
   
     //render wager board
      res.render("wager-board", {
        answers: PROCESSEDANSWERS,
        highestodds: utils.getHighestOdds(PROCESSEDANSWERS),
        playerId: PLAYERID,
        gameId: GAMEID,
        playerList: utils.getPlayerList(GAMEID),
      });
  
      return;
    }

  //send empty response if all players haven't submitted an answer
  res.sendStatus(204);

  //utils.drawDebug();
};

export default checkAnsweredStatus