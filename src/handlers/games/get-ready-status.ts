import express from "express";
import { gameStore } from "../../server";

const checkReadyStatus = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.params.gameId)]
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = GAME.questionIndex;
  
    GAME.UpdateReadyStatus();
  
    //if player is host then show start button
    if (GAME.isHost(PLAYERID)) {
      res.render("start-btn", {
        gameId: GAME.gameId,
        playersReady: GAME.playersReady,
      });
    } else {
      //if all players are ready and game has started then show question
      if (GAME.state == "Question" && GAME.playersReady) {
        let questionObj = GAME.questions[QUESTIONINDEX];
        questionObj.gameId = GAME.gameId;
        questionObj.playerId = PLAYERID;
        //add HX-Retarget to question so replaces the contents of the center div
        res.set("HX-Retarget", ".content");
        res.render("question", questionObj);
        return;
      }
  
      //send empty response if all players aren't ready or game hasn't started
      res.sendStatus(204);
    }
  };

  export {checkReadyStatus}