import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import moment from "moment";

const submitAnswer = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];
  const QUESTIONINDEX = GAME.questionIndex;
  const SUBMITTEDANSWER = String(req.query.submittedAnswer);
  console.log(req.query);
  console.log(SUBMITTEDANSWER);
  PLAYER.answeredStatus = true;
  PLAYER.answer =
    GAME.questions[QUESTIONINDEX].answerType == "number"
      ? String(SUBMITTEDANSWER)
      : String(moment(SUBMITTEDANSWER, "DD-MM-YYYY").toDate().getTime());

  GAME.updateAnsweredStatus();

  res.sendStatus(204);
};

export { submitAnswer };
