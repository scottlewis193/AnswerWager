import express from "express";
import { gameStore, playerStore } from "../../server";
import { debug } from "../../utils";

const showQuestion = (req: express.Request, res: express.Response) => {
  const GAMEID = Number(req.params.gameId);
  const GAME = gameStore.Games[Number(req.params.gameId)];
  const PLAYERID = Number(req.query.playerId);
  const PLAYER = playerStore.Players[PLAYERID];

  //RESET FOR NEXT QUESTION
  if (GAME.state !== "Question") {
    GAME.resetGameForRound();
  }

  GAME.state = "Question";

  if (GAME.questionIndex > GAME.questions.length - 1) {
    GAME.state = "FinalScores";
  }

  if (GAME.state == "Question") {
    let questionObj = GAME.questions[GAME.questionIndex];
    questionObj.gameId = GAMEID;
    questionObj.playerId = PLAYERID;
    questionObj.playerList = GAME.GetPlayerList();

    res.render("question", questionObj);
  } else {
    //get player list objects and sort by points earned this round
    const PLAYERS = GAME.GetPlayerList().sort((a, b) =>
      a.points > b.points ? 1 : b.points > a.points ? -1 : 0
    );

    res.render("final-score-board", {
      players: PLAYERS,
      playerId: PLAYER.playerId,
      gameId: GAME.gameId,
    });
  }
};

export { showQuestion };
