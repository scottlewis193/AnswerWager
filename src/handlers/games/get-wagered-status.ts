import express from "express";
import { gameStore, playerStore } from "../../server";

const checkWageredStatus = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.params.gameId)];

    GAME.UpdateWageredStatus();

    if(GAME.playersWagered) {
      //determine which board segment to highlight
      //TODO
    }
  
}

export { checkWageredStatus }