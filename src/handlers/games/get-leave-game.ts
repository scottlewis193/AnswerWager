
import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";

const leaveGame = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.params.gameId)];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];

    GAME.updateLobbyUI(PLAYER.playerId);
  
  //remove player from array of playerids in game
  GAME.playerIds.splice(
    GAME.playerIds.indexOf(PLAYER.playerId),
    1
  );
  
    //check if player is hosting game and if so, remove game from obj
    if (GAME.hostPlayerId == PLAYER.playerId) {
      debug(`${GAME.gameId}: game removed`);
      gameStore.DeleteGame(GAME.gameId);
    }
  
    debug(`${GAME.gameId}: ${PLAYER.playerName} has left the game (${PLAYER.playerId})`);
  
    res.render("main-menu", {
      playerId: PLAYER.playerId,
      playerName: PLAYER.playerName,
    });
  };

  export {leaveGame}