import express from "express";
import { boolConv } from "../../utils";
import { PLAYERSTORE, GAMESTORE } from "../../server";
import { wss } from "../../server";
import { Game } from "../../store/games";
import { newViewData } from "../../store/viewdata";

const updatePlayerReadyStatus = (
  req: express.Request,
  res: express.Response
) => {
  const PLAYER = PLAYERSTORE.Players[Number(req.params.playerId)];

  PLAYER.updateRequired = true;

  let GAME = GAMESTORE.getPlayersGame(PLAYER.playerId);

  PLAYER.readyStatus = !PLAYER.readyStatus;

  GAME.updateUI(PLAYER.playerId);
  GAME.updateReadyStatus();

  //rerender pre-game-lobby
  res.render("pre-game-lobby", newViewData(PLAYER.playerId, GAME.gameId));
};

export { updatePlayerReadyStatus };
