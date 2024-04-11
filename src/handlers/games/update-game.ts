import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { debug } from "../../utils";
import { Player } from "../../store/players";
import { Game } from "../../store/games";

const updateGame = (req: express.Request, res: express.Response) => {
  const PLAYER = PLAYERSTORE.Players[Number(req.body.playerId)];
  const BODY = req.body;
  const GAME = GAMESTORE.getGame(Number(req.params.gameId));
  const PROMPT = req.get("HX-Prompt");

  delete BODY.gameId;

  if (GAME.isHost(PLAYER.playerId)) {
    if (BODY.hasOwnProperty("state")) {
      handleStateChange(PLAYER, BODY, GAME, res);
    }

    GAME.updateUI();
  }

  return res.sendStatus(204);
};

const handleStateChange = (
  PLAYER: Player,
  BODY: any,
  GAME: Game,
  res: express.Response
) => {
  switch (BODY.state) {
    case "Question":
      if (GAME.questions[GAME.questionIndex] == null) {
        debug(
          `${PLAYER.playerName} (${PLAYER.playerId}): unable to start game (${GAME.gameId})`
        );
        return res.sendStatus(204);
      }

      //IF START OF GAME, RESET PLAYERS FOR GAME
      if (GAME.getGameStateStr() == "PreGameLobby") {
        GAME.resetPlayersForGame();

        debug(
          `${PLAYER.playerName} (${PLAYER.playerId}): started game (${GAME.gameId})`
        );
      }

      break;
    case "Scores":
      break;
  }

  GAME.updateGameFromBody(BODY);
};

export { updateGame };
