import express from "express";
import { GAMESTORE, PLAYERSTORE, wss } from "../../server";
import { debug } from "../../utils";
import pug from "pug";
import { newViewData } from "../../store/viewdata";

const startGame = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.body.playerId)];
  const QUESTIONINDEX = GAME.questionIndex;

  let questionObj = GAME.questions[QUESTIONINDEX];

  if (questionObj == null) {
    debug(
      `${PLAYER.playerName} (${PLAYER.playerId}): unable to start game (${GAME.gameId})`
    );
    return res.sendStatus(204);
  }

  questionObj.gameId = GAME.gameId;
  questionObj.playerId = PLAYER.playerId;
  questionObj.players = GAME.getPlayers();

  GAME.resetPlayersForGame();

  GAME.setGameStateFromStr("Question");

  debug(
    `${PLAYER.playerName} (${PLAYER.playerId}): started game (${GAME.gameId})`
  );
  // wss.emit(
  //   "game_start",
  //   pug.render("question", newViewData(PLAYER.playerId, GAME.gameId))
  // );

  return res.sendStatus(204);
};

export { startGame };
