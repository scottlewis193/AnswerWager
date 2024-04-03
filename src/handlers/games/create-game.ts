import express from "express";
import { GAMESTORE, PLAYERSTORE } from "../../server";
import { debug } from "../../utils";

const createGame = (req: express.Request, res: express.Response) => {
  const PLAYER = PLAYERSTORE.Players[Number(req.params.playerId)];

  //add game info to games object
  const NEWGAMEID = GAMESTORE.createGame(PLAYER.playerId);

  debug(
    `${PLAYER.playerName} (${PLAYER.playerId}): created new game (${NEWGAMEID})`
  );

  const GAME = GAMESTORE.Games[NEWGAMEID];

  //res.send(`<div class='page pre-game-lobby' hx-target='.content' hx-trigger='load, every 5s' hx-vals='{"playerId": "10001"}' hx-get='/games/${NEWGAMEID}/updatelobby'></div>`);

  //send game-lobby screen to client
  res.render("pre-game-lobby", {
    playerId: PLAYER.playerId,
    gameId: NEWGAMEID,
    playerName: PLAYER.playerName,
    isHost: true,
    players: GAME.getPlayers(),
  });
};

export { createGame };