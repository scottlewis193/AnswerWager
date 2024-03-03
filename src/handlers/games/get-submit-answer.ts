
import express from "express";
import { gameStore, playerStore } from "../../server";

const submitAnswer = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.params.gameId)];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];
    const QUESTIONINDEX = GAME.questionIndex;
    const SUBMITTEDANSWER = String(req.query.submittedAnswer);
    console.log(req.query)
  console.log(SUBMITTEDANSWER)
    PLAYER.answeredStatus = true;
    PLAYER.answers[QUESTIONINDEX] = {playerId: PLAYER.playerId, answer: SUBMITTEDANSWER, answerType: '' };
  
    GAME.UpdateAnsweredStatus();
  
    res.sendStatus(204);
  };

  export {submitAnswer}