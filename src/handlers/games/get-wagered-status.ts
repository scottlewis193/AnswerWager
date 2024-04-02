import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";
import { BoardAnswer } from "../../store/answers";
import { getHighestOdds } from "../../utils";

const checkWageredStatus = (req: express.Request, res: express.Response) => {
  const GAME = gameStore.Games[Number(req.params.gameId)];
  const PLAYER = playerStore.Players[Number(req.query.playerId)];

  GAME.UpdateWageredStatus();

  if (GAME.playersWagered) {
    debug(
      `${GAME.gameId}: all players have finished wagering (${GAME.questionIndex})`
    );

    //determine which board segment to highlight
    //TODO

    const playerBetAnswers = PLAYER.GetBetAnswers();

    //create array of answers to show whether player has wagered so view can be modified appropriately
    const answers: BoardAnswer[] = [];

    GAME.processedAnswers.forEach((answer) =>
      answers.push({
        answer: answer.answer,
        odds: answer.odds,
        wagered: playerBetAnswers.includes(answer.answer),
        correctAnswer: answer.correctAnswer,
      })
    );

    GAME.state = "AnswerReveal";

    console.log(answers);
    //rerender wager-board
    res.render("wager-board-reveal", {
      playerBetAnswers: playerBetAnswers,
      answers: answers,
      highestodds: getHighestOdds(GAME.processedAnswers),
      player: PLAYER,
      playerId: PLAYER.playerId,
      gameId: GAME.gameId,
      playerList: GAME.GetPlayerList(),
      btnsDisabled: PLAYER.bets.length >= 2 || PLAYER.wageredStatus,
      smallerCorrect: answers.every((answer) => answer.correctAnswer === false), //if correct answer is smaller than all submitted answers
    });
    return;
  }

  //send empty response if all players haven't finished wagering
  res.sendStatus(204);
};

export { checkWageredStatus };
