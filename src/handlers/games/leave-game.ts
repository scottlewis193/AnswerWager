import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { debug } from "../../utils";
import { newViewData } from "../../store/viewdata";

const leaveGame = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.body.playerId)];

  GAME.updateUI(PLAYER.playerId);

  //remove player from array of playerids in game
  GAME.playerIds.splice(GAME.playerIds.indexOf(PLAYER.playerId), 1);

  //check if player is hosting game and if so, remove game from obj
  if (GAME.hostPlayerId == PLAYER.playerId) {
    debug(`${GAME.gameId}: game removed`);
    GAMESTORE.deleteGame(GAME.gameId);
  }

  debug(
    `${GAME.gameId}: ${PLAYER.playerName} has left the game (${PLAYER.playerId})`
  );

  res.render("main-menu", newViewData(PLAYER.playerId));
};

export { leaveGame };
