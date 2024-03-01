
import express from "express";
import { gameStore, playerStore, wss } from "../../server";
import { debug } from "../../utils";
import pug from "pug";

const startGame = (req : express.Request, res : express.Response) => {
    const GAME = gameStore.Games[Number(req.params.gameId)];
    const PLAYER = playerStore.Players[Number(req.query.playerId)];
    const QUESTIONINDEX = GAME.questionIndex;

    let questionObj = GAME.questions[QUESTIONINDEX];
    questionObj.gameId = GAME.gameId;
    questionObj.playerId = PLAYER.playerId;
    questionObj.playerList = GAME.GetPlayerList();
  
    GAME.state = "Question";


    debug(`${PLAYER.playerName} (${PLAYER.playerId}): started game (${GAME.gameId})`);
    wss.emit("game_start", pug.render("question.pug",questionObj));
    
    res.sendStatus(204);
  };

  export {startGame}