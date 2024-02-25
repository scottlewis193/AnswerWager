import express from "express";
import { gameStore } from "../../server";


const createGame = (req : express.Request, res : express.Response) => {
  
    const PLAYERID = Number(req.query.playerId);
    const PLAYERNAME = req.query.playerName;
  
    //add game info to games object
    const NEWGAMEID = gameStore.CreateGame(PLAYERID);
  
    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYERID,
      gameId: NEWGAMEID,
      playerName: PLAYERNAME,
      isHost: true,
    });
  };

  export { createGame }