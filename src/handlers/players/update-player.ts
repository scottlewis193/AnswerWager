import express from "express";
import { boolConv, keys } from "../../utils";
import { PLAYERSTORE, GAMESTORE } from "../../server";
import { wss } from "../../server";
import { Game } from "../../store/games";
import { newViewData } from "../../store/viewdata";
import { Player } from "../../store/players";
import moment from "moment";
import { BoardAnswer } from "../../store/answers";

const updatePlayer = (req: express.Request, res: express.Response) => {
  const PLAYER = PLAYERSTORE.Players[Number(req.params.playerId)];
  const BODY = req.body;
  const GAME = GAMESTORE.getPlayersGame(PLAYER.playerId);
  const PROMPT = req.get("HX-Prompt");

  delete BODY.playerId;

  if (BODY.hasOwnProperty("readyStatus")) {
    handleSetReadyStatus(PLAYER, BODY, GAME, res);
  } else if (BODY.hasOwnProperty("answer") && typeof PROMPT === "undefined") {
    handleSubmitAnswer(PLAYER, BODY, GAME, res);
  } else if (BODY.hasOwnProperty("answer") && typeof PROMPT !== "undefined") {
    handleSubmitBet(PLAYER, GAME, BODY, PROMPT, res);
  } else if (BODY.hasOwnProperty("wageredStatus")) {
    handleSetWageredStatus(PLAYER, BODY, GAME, res);
  } else {
    return res.sendStatus(204);
  }
};

const handleSetReadyStatus = (
  PLAYER: Player,
  BODY: any,
  GAME: Game,
  res: express.Response
) => {
  GAME.updateUI(PLAYER.playerId);
  PLAYER.updatePlayerFromBody(BODY);
  return res.render(
    "pre-game-lobby",
    newViewData(PLAYER.playerId, GAME.gameId)
  );
};

const handleSubmitAnswer = (
  PLAYER: Player,
  BODY: any,
  GAME: Game,
  res: express.Response
) => {
  BODY.answer =
    GAME.questions[GAME.questionIndex].answerType == "number"
      ? Number(BODY.answer)
      : moment(BODY.answer, "DD-MM-YYYY").toDate().getTime();
  PLAYER.updatePlayerFromBody(BODY);
  return res.render("question", newViewData(PLAYER.playerId, GAME.gameId));
};

const handleSetWageredStatus = (
  PLAYER: Player,
  BODY: any,
  GAME: Game,
  res: express.Response
) => {
  PLAYER.updatePlayerFromBody(BODY);
  return res.render("wager-board", newViewData(PLAYER.playerId, GAME.gameId));
};

const handleSubmitBet = (
  PLAYER: Player,
  GAME: Game,
  BODY: any,
  PROMPT: string,
  res: express.Response
) => {
  const PLAYERBETS = PLAYER.getBetAnswers();
  const ANSWER = BODY.answer;
  const AMOUNT = Number(PROMPT);

  //validation
  if (PLAYERBETS.includes(ANSWER)) {
    res.set(
      "HX-Trigger",
      '{"showMessage":"You have already wagered this answer"}'
    );
    return res.sendStatus(204);
  }

  if (PLAYER.points < AMOUNT) {
    res.set("HX-Trigger", '{"showMessage":"You do not have enough points"}');
    return res.sendStatus(204);
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
      amount: AMOUNT,
      odds: GAME.getAnswer(ANSWER).odds,
    });
    PLAYER.points -= AMOUNT;

    //if player has 0 points then set wagered status to true (prevent player from wagering again)
    if (PLAYER.points == 0) {
      PLAYER.wageredStatus = true;
    }

    if (ANSWER == "SMALLER") {
      PLAYER.smallerWagered = true;
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
      displayedAnswer: answer.displayedAnswer,
      odds: answer.odds,
      wagered: PLAYERBETS.includes(answer.answer),
      correctAnswer: false,
    })
  );

  return res.render("wager-board", newViewData(PLAYER.playerId, GAME.gameId));
};

export { updatePlayer };
