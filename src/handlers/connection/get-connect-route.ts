import express from "express";
import { playerStore, gameStore } from "../../server.js";

const connectRoute = (req : express.Request, res : express.Response) => {

    const PLAYERID = Number(req.query.playerId)
  
    res.render("main-menu", {
      playerId: String(PLAYERID),
    });
  
  
  
    //check if playerName exists in req.query and if so set it
    if (req.query.hasOwnProperty("playerName"))
      playerStore.GetPlayer(PLAYERID).playerName = String(req.query.playerName);
  };

  export { connectRoute }