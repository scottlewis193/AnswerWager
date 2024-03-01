import express from "express";
import { gameStore, playerStore,wss } from "../../server";
import { debug } from "../../utils";
import pug from "pug"


const joinGame = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.get("HX-Prompt"))];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];
  
    GAME.updateRequired = true;
    PLAYER.updateRequired = true;
    GAME.playerIds.push(PLAYER.playerId);

    debug(`${GAME.gameId}: ${PLAYER.playerName} has joined the game (${PLAYER.playerId})`);

 
    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYER.playerId,
      gameId: GAME.gameId,
      playerName: PLAYER.playerName,
      isHost: false,
      playerList: GAME.GetPlayerList()
    });
  };

  export {joinGame}