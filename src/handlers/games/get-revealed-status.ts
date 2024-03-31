import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";

const checkRevealedStatus = (req: express.Request, res: express.Response) => {
  const GAME = gameStore.Games[Number(req.query.gameId)];
  const PLAYER = playerStore.Players[Number(req.query.playerId)];

  GAME.calculateScores();
  //get player list objects and sort by points earned this round
  const PLAYERS = GAME.GetPlayerList().sort((a, b) =>
    a.pointsEarnedRound > b.pointsEarnedRound
      ? 1
      : b.pointsEarnedRound > a.pointsEarnedRound
      ? -1
      : 0
  );

  res.render("score-board", {
    players: PLAYERS,
    playerId: PLAYER.playerId,
    gameId: GAME.gameId,
  });
};

export { checkRevealedStatus };
