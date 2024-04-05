import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { debug } from "../../utils";
import { newViewData } from "../../store/viewdata";

const checkRevealedStatus = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.query.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];

  GAME.calculateScores();
  //get player list objects and sort by points earned this round
  const PLAYERS = GAME.getPlayers().sort((a, b) =>
    a.pointsEarnedRound < b.pointsEarnedRound
      ? 1
      : b.pointsEarnedRound < a.pointsEarnedRound
      ? -1
      : 0
  );

  GAME.updateGameState();

  res.render("score-board", newViewData(PLAYER.playerId, GAME.gameId));
};

export { checkRevealedStatus };
