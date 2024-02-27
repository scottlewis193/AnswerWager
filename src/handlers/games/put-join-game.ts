import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";

const joinGame = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.get("HX-Prompt"))];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];
  
    GAME.playerIds.push(PLAYER.playerId);

    debug(`${GAME.gameId}: ${PLAYER.playerName} has joined the game (${PLAYER.playerId})`);
  
    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYER.playerId,
      gameId: GAME.gameId,
      playerName: PLAYER.playerName,
      isHost: false,
    });
  };

  export {joinGame}