import express from "express";
import { PLAYERSTORE, GAMESTORE } from "../../server.js";
import { debug } from "../../utils.js";
import { newViewData } from "../../store/viewdata.js";

const connectRoute = (req: express.Request, res: express.Response) => {
  const PLAYER = PLAYERSTORE.Players[Number(req.body.playerId)];

  if (typeof req.body.playerName !== "undefined") {
    PLAYERSTORE.Players[PLAYER.playerId].playerName = String(
      req.body.playerName
    );
  }

  debug(`${PLAYER.playerName} (${PLAYER.playerId}): connected to server`);

  return res.render("main-menu", newViewData(PLAYER.playerId));
};

export { connectRoute };
