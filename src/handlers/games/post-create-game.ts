import express from "express";
import { gameStore, playerStore } from "../../server";


const createGame = (req : express.Request, res : express.Response) => {

    const PLAYER = playerStore.Players[Number(req.query.playerId)];
  
    //add game info to games object
    const NEWGAMEID = gameStore.CreateGame(PLAYER.playerId);


    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYER.playerId,
      gameId: NEWGAMEID,
      playerName: PLAYER.playerName,
      isHost: true,
    });
  };

  export { createGame }