import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";

const submitAnswer = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];
  const QUESTIONINDEX = GAME.questionIndex;
  const SUBMITTEDANSWER = String(req.query.submittedAnswer);
  console.log(req.query);
  console.log(SUBMITTEDANSWER);
  PLAYER.answeredStatus = true;
  PLAYER.answer = {
    playerId: PLAYER.playerId,
    answer: SUBMITTEDANSWER,
    answerType: "",
  };

  GAME.updateAnsweredStatus();

  res.sendStatus(204);
};

export { submitAnswer };
