import express from "express";
import { GAMESTORE, PLAYERSTORE, wss } from "../../server";
import { debug } from "../../utils";
import pug from "pug";

const startGame = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];
  const QUESTIONINDEX = GAME.questionIndex;

  let questionObj = GAME.questions[QUESTIONINDEX];

  if (questionObj == null) {
    debug(
      `${PLAYER.playerName} (${PLAYER.playerId}): unable to start game (${GAME.gameId})`
    );
    res.sendStatus(204);
  }

  questionObj.gameId = GAME.gameId;
  questionObj.playerId = PLAYER.playerId;
  questionObj.playerList = GAME.getPlayerList();

  GAME.updateGameState();

  debug(
    `${PLAYER.playerName} (${PLAYER.playerId}): started game (${GAME.gameId})`
  );
  wss.emit("game_start", pug.render("question.pug", questionObj));

  res.sendStatus(204);
};

export { startGame };
