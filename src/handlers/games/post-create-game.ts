import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";


const createGame = (req : express.Request, res : express.Response) => {

    const PLAYER = playerStore.Players[Number(req.query.playerId)];
  
    //add game info to games object
    const NEWGAMEID = gameStore.CreateGame(PLAYER.playerId);

    debug(`${PLAYER.playerName} (${PLAYER.playerId}): created new game (${NEWGAMEID})`);

    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYER.playerId,
      gameId: NEWGAMEID,
      playerName: PLAYER.playerName,
      isHost: true,
    });
  };

  export { createGame }