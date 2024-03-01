import express from "express";
import { PlayerVars } from "../../store/store";
import { boolConv } from "../../utils";
import { playerStore, gameStore } from "../../server";
import { wss } from "../../server";
import { Game } from "../../store/games";


const updatePlayer = (req : express.Request, res : express.Response) => {
    var playerVars : PlayerVars = req.query;
    playerVars.playerId = Number(req.params.playerId);
    const PLAYER = playerStore.Players[playerVars.playerId];

    PLAYER.updateRequired = true;

    //ready/unready btn
    if (req.query.hasOwnProperty("readyStatus")) {
      PLAYER.readyStatus = boolConv(
        String(req.query.readyStatus)
      );
      playerVars.readyStatus = boolConv(String(req.query.readyStatus));

      //find game that player is in
      let GAME: Game;
      for (var gameId in gameStore.Games) {
        for (var player in gameStore.Games[gameId].playerIds) {
          if (gameStore.Games[gameId].playerIds[player] == playerVars.playerId) {
            GAME = gameStore.Games[gameId];

            GAME.updateLobbyUI(PLAYER.playerId);
            
            //update ready status - update readyStatus if all players are ready
            GAME.UpdateReadyStatus();

            //rerender pre-game-lobby
            res.render("pre-game-lobby", {
              playerId: PLAYER.playerId,
              gameId: GAME.gameId,
              playerName: PLAYER.playerName,
              isHost: GAME.isHost(PLAYER.playerId),
              readyStatus: PLAYER.readyStatus,
              playerList: GAME.GetPlayerList(),
              playersReady: GAME.playersReady,
            });

            break;
          }
        }
      }
   
    }
  };

  export { updatePlayer }