import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { debug } from "../../utils";
import { newViewData } from "../../store/viewdata";

const showQuestion = (req: express.Request, res: express.Response) => {
  const GAMEID = Number(req.params.gameId);
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const PLAYERID = Number(req.query.playerId);
  const PLAYER = PLAYERSTORE.Players[PLAYERID];

  //RESET FOR NEXT QUESTION
  if (GAME.getGameState() !== "Question") {
    GAME.resetGameForRound();
  }

  GAME.setGameState("Question");

  if (GAME.questionIndex > GAME.questions.length - 1) {
    GAME.setGameState("FinalScores");
  }

  if (GAME.getGameState() == "Question") {
    let questionObj = GAME.questions[GAME.questionIndex];
    questionObj.gameId = GAMEID;
    questionObj.playerId = PLAYERID;
    questionObj.players = GAME.getPlayers();

    res.render("question", newViewData(PLAYER.playerId, GAME.gameId));
  } else {
    //get player list objects and sort by points earned this round
    const PLAYERS = GAME.getPlayers().sort((a, b) =>
      a.points > b.points ? 1 : b.points > a.points ? -1 : 0
    );

    res.render("final-score-board", newViewData(PLAYER.playerId, GAME.gameId));
  }
};

export { showQuestion };
