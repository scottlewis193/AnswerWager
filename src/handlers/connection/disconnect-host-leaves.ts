import express from "express";
import { newViewData } from "../../store/viewdata";

const disconnectHostLeaves = (req: express.Request, res: express.Response) => {
  const PLAYERID = req.query.playerId;
  const PLAYERNAME = req.query.playerName;

  //render main menu
  res.render("main-menu", newViewData(Number(PLAYERID)));
};

export { disconnectHostLeaves };
