import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { Player } from "../../store/players";
import { wss } from "../../server";
import { debug } from "../../utils";
import { newViewData } from "../../store/viewdata";

const updateGameUIState = (req: express.Request, res: express.Response) => {
  const GAMEID = Number(req.params.gameId);
  const GAME = GAMESTORE.Games[GAMEID];
  const PLAYER = PLAYERSTORE.Players[Number(req.body.playerId)];

  if (GAME == null) {
    //return res.sendStatus(204);
    res.render("main-menu", newViewData(PLAYER.playerId));
    return;
  }

  if (PLAYER.updateRequired) {
    PLAYER.updateRequired = false;

    const GAMESTATE = GAME.getGameStateStr();

    switch (GAMESTATE) {
      case "PreGameLobby":
        return res.render(
          "pre-game-lobby",
          newViewData(PLAYER.playerId, GAME.gameId)
        );
      case "Question":
        return res.render(
          "question",
          newViewData(PLAYER.playerId, GAME.gameId)
        );
      case "Wagering":
        return res.render(
          "wager-board",
          newViewData(PLAYER.playerId, GAME.gameId)
        );
      case "AnswerReveal":
        return res.render(
          "wager-board-reveal",
          newViewData(PLAYER.playerId, GAME.gameId)
        );
      case "Scores":
        return res.render(
          "score-board",
          newViewData(PLAYER.playerId, GAME.gameId)
        );
      case "FinalScores":
        return res.render(
          "score-stats-list",
          newViewData(PLAYER.playerId, GAME.gameId)
        );
      default:
        return res.sendStatus(204);
    }
  }
  return res.sendStatus(204);
};

export { updateGameUIState };
