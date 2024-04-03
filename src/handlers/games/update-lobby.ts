import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { Player } from "../../store/players";
import { wss } from "../../server";
import { debug } from "../../utils";

const updateLobby = (req: express.Request, res: express.Response) => {
  const GAMEID = Number(req.params.gameId);
  const GAME = GAMESTORE.Games[GAMEID];
  const PLAYER = PLAYERSTORE.Players[Number(req.query.playerId)];

  if (GAME == null) {
    res.render("disconnect", { playerId: PLAYER.playerId });
  }
  const QUESTIONINDEX = GAME.questionIndex;

  var playerList: Player[] = GAME.getPlayers();

  //ALL PLAYERS ARE READY AND HOST HAS STARTED GAME
  if (GAME.getGameState() == "Question" && GAME.playersReady) {
    debug(`${GAME.gameId}: game has started`);

    let questionObj = GAME.questions[QUESTIONINDEX];
    questionObj.gameId = GAME.gameId;
    questionObj.playerId = PLAYER.playerId;
    //add HX-Retarget to question so replaces the contents of the center div
    res.set("HX-Retarget", ".content");
    res.render("question", questionObj);
    return;
  }

  //IF LOBBY REQUIRES UPDATE, RERENDER PRE-GAME LOBBY
  if (PLAYER.updateRequired) {
    PLAYER.updateRequired = false;
    res.render("pre-game-lobby", {
      playerId: PLAYER.playerId,
      gameId: GAME.gameId,
      playerName: PLAYER.playerName,
      isHost: GAME.isHost(PLAYER.playerId),
      players: GAME.getPlayers(),
      readyStatus: PLAYER.readyStatus,
      playersReady: GAME.playersReady,
    });
  } else {
    res.sendStatus(204);
  }
};

export { updateLobby };
