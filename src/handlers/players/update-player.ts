import express from "express";
import { boolConv, keys } from "../../utils";
import { PLAYERSTORE, GAMESTORE } from "../../server";
import { wss } from "../../server";
import { Game } from "../../store/games";
import { newViewData } from "../../store/viewdata";
import { Player } from "../../store/players";
import moment from "moment";

const updatePlayer = (req: express.Request, res: express.Response) => {
  const PLAYER = PLAYERSTORE.Players[Number(req.params.playerId)];
  const BODY = req.body;
  const GAME = GAMESTORE.getPlayersGame(PLAYER.playerId);

  //make sure playerId is not updated
  delete BODY.playerId;

  //trigger UI update for every player in game
  GAME.updateUI(PLAYER.playerId);

  if (BODY.hasOwnProperty("readyStatus")) {
    //update player object using body
    PLAYER.updatePlayerFromBody(BODY);

    //rerender pre-game-lobby
    return res.render(
      "pre-game-lobby",
      newViewData(PLAYER.playerId, GAME.gameId)
    );
  } else if (BODY.hasOwnProperty("answeredStatus")) {
    //makes sure submitted is in correct format
    BODY.answer =
      GAME.questions[GAME.questionIndex].answerType == "number"
        ? Number(BODY.answer)
        : moment(BODY.answer, "DD-MM-YYYY").toDate().getTime();

    //update player object using body
    PLAYER.updatePlayerFromBody(BODY);

    //render question screen
    return res.render("question", newViewData(PLAYER.playerId, GAME.gameId));
  } else if (BODY.hasOwnProperty("wageredStatus")) {
    //render wager board
    return res.render("wager-board", newViewData(PLAYER.playerId, GAME.gameId));
  }

  return res.sendStatus(204);
};

export { updatePlayer };
