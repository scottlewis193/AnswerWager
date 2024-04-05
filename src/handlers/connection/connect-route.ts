import express from "express";
import { PLAYERSTORE, GAMESTORE } from "../../server.js";
import { debug } from "../../utils.js";
import { newViewData } from "../../store/viewdata.js";

const connectRoute = (req: express.Request, res: express.Response) => {
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];

  //check if playerName exists in req.query and if so set it
  if (req.query.hasOwnProperty("playerName"))
    PLAYERSTORE.Players[PLAYER.playerId].playerName = String(
      req.query.playerName
    );

  debug(`${PLAYER.playerName} (${PLAYER.playerId}): connected to server`);

  res.render("main-menu", newViewData(PLAYER.playerId));
};

export { connectRoute };
