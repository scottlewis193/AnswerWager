import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";

const checkRevealedStatus = (req: express.Request, res: express.Response) => {
  const GAME = gameStore.Games[Number(req.query.gameId)];
  const PLAYER = playerStore.Players[Number(req.query.playerId)];

  GAME.calculateScores();

  res.render("score-board", {});
};
