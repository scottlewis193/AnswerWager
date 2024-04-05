import express from "express";
import { GAMESTORE, PLAYERSTORE, wss } from "../../server";
import { debug } from "../../utils";
import pug from "pug";
import { newViewData } from "../../store/viewdata";

const joinGame = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.get("HX-Prompt"))];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];

  GAME.updateLobbyUI(PLAYER.playerId);
  GAME.playerIds.push(PLAYER.playerId);

  debug(
    `${GAME.gameId}: ${PLAYER.playerName} has joined the game (${PLAYER.playerId})`
  );

  //send game-lobby screen to client
  res.render("pre-game-lobby", newViewData(PLAYER.playerId, GAME.gameId));
};

export { joinGame };
