import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { getHighestOdds, debug } from "../../utils";
import { BoardAnswer } from "../../store/answers";

const submitBet = (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];
  const BET = Number(req.get("HX-Prompt"));
  const ANSWER = String(req.query.answer);

  const playerBetAnswers = PLAYER.getBetAnswers();

  //validation
  if (playerBetAnswers.includes(ANSWER)) {
    res.set(
      "HX-Trigger",
      '{"showMessage":"You have already wagered this answer"}'
    );
    res.sendStatus(204);
    return;
  }

  if (PLAYER.points < BET) {
    res.set("HX-Trigger", '{"showMessage":"You do not have enough points"}');
    res.sendStatus(204);
    return;
  }

  //if player has already submitted 2 bets then disable bet buttons
  if (PLAYER.bets.length >= 2) {
    //set wagered status to true
    PLAYER.wageredStatus = true;
  }

  //if player has not submitted 2 bets
  if (PLAYER.bets.length < 2) {
    //add bet to player
    PLAYER.bets.push({
      playerId: PLAYER.playerId,
      answer: ANSWER,
      amount: BET,
      odds: GAME.getAnswer(ANSWER).odds,
    });
    PLAYER.points -= BET;

    //if player has 0 points then set wagered status to true (prevent player from wagering again)
    if (PLAYER.points == 0) {
      PLAYER.wageredStatus = true;
    }
  }

  //if player has submitted 2 bets
  if (PLAYER.bets.length == 2) {
    //set wagered status to true
    PLAYER.wageredStatus = true;
  }

  //create array of answers to show whether player has wagered so view can be modified appropriately
  const answers: BoardAnswer[] = [];

  GAME.processedAnswers.forEach((answer) =>
    answers.push({
      answer: answer.answer,
      odds: answer.odds,
      wagered: playerBetAnswers.includes(answer.answer),
      correctAnswer: false,
    })
  );

  //rerender wager-board
  res.render("wager-board", {
    playerBetAnswers: playerBetAnswers,
    answers: answers,
    highestodds: getHighestOdds(GAME.processedAnswers),
    player: PLAYER,
    playerId: PLAYER.playerId,
    gameId: GAME.gameId,
    playerList: GAME.getPlayerList(),
    btnsDisabled: PLAYER.bets.length >= 2 || PLAYER.wageredStatus,
    smallerWagered: ANSWER == "SMALLER",
    revealAnswer: false,
  });

  return;
};

export { submitBet };
