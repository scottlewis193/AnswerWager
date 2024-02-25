import express from "express";
import { gameStore, playerStore } from "../../server";

const joinGame = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.get("HX-Prompt"))];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];
  
    GAME.playerIds.push(PLAYER.playerId);
  
    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYER.playerId,
      gameId: GAME.gameId,
      playerName: PLAYER.playerName,
      isHost: false,
    });
  };

  export {joinGame}