
import express from "express";
import { gameStore, playerStore } from "../../server";

const leaveGame = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.query.gameId)];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];
  
  //remove player from array of playerids in game
  GAME.playerIds.splice(
    GAME.playerIds.indexOf(PLAYER.playerId),
    1
  );
  
    //check if player is hosting game and if so, remove game from obj
    if (GAME.hostPlayerId == PLAYER.playerId) {
      gameStore.DeleteGame(GAME.gameId);
    }
  
    
  
    res.render("main-menu", {
      playerId: PLAYER.playerId,
      playerName: PLAYER.playerName,
    });
  };

  export {leaveGame}