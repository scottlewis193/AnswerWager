import express from "express";
import { boolConv } from "../../utils";
import { PLAYERSTORE, GAMESTORE } from "../../server";
import { wss } from "../../server";
import { Game } from "../../store/games";

const updatePlayer = (req: express.Request, res: express.Response) => {
  //var playerVars: PlayerVars = req.query;
  //playerVars.playerId = Number(req.query.playerId);
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];

  PLAYER.updateRequired = true;

  //ready/unready btn
  if (req.query.hasOwnProperty("readyStatus")) {
    PLAYER.readyStatus = boolConv(String(req.query.readyStatus));

    //find game that player is in
    let GAME: Game;
    for (var gameId in GAMESTORE.Games) {
      for (var player in GAMESTORE.Games[gameId].playerIds) {
        if (GAMESTORE.Games[gameId].playerIds[player] == PLAYER.playerId) {
          GAME = GAMESTORE.Games[gameId];

          GAME.updateLobbyUI(PLAYER.playerId);

          //update ready status - update readyStatus if all players are ready
          GAME.updateReadyStatus();

          //rerender pre-game-lobby
          res.render("pre-game-lobby", {
            playerId: PLAYER.playerId,
            gameId: GAME.gameId,
            playerName: PLAYER.playerName,
            isHost: GAME.isHost(PLAYER.playerId),
            readyStatus: PLAYER.readyStatus,
            players: GAME.getPlayers(),
            playersReady: GAME.playersReady,
          });

          break;
        }
      }
    }
  }
};

export { updatePlayer };
