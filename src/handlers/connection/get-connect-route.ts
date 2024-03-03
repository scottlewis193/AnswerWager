import express from "express";
import { playerStore, gameStore } from "../../server.js";
import {debug} from "../../utils.js"

const connectRoute = (req : express.Request, res : express.Response) => {
    const PLAYER = playerStore.Players[Number(req.query.playerId)];
  

 //check if playerName exists in req.query and if so set it
 if (req.query.hasOwnProperty("playerName")) playerStore.Players[PLAYER.playerId].playerName = String(req.query.playerName);

 debug(`${PLAYER.playerName} (${PLAYER.playerId}): connected to server`);


    res.render("main-menu", {
      playerId: PLAYER.playerId,
    });
    
    
  };
   

  export { connectRoute }