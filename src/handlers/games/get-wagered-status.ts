import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";

const checkWageredStatus = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.params.gameId)];

    GAME.UpdateWageredStatus();

    if(GAME.playersWagered) {

      debug(`${GAME.gameId}: all players have finished wagering (${GAME.questionIndex})`);

      //determine which board segment to highlight
      //TODO
    }
  
}

export { checkWageredStatus }