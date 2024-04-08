import express from "express";
import { newViewData } from "../../store/viewdata";

const getGameRules = (req: express.Request, res: express.Response) => {
  const PLAYERID = Number(req.query.playerId);

  res.render("game-rules", newViewData(PLAYERID));
};

export { getGameRules };
