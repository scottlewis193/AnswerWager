import express from "express";
import { gameStore } from "../../server";
import { debug } from "../../utils";

const showQuestion = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const GAME = gameStore.Games[Number(req.params.gameId)];
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = GAME.questionIndex;

    let questionObj = GAME.questions[QUESTIONINDEX];
    questionObj.gameId = GAMEID;
    questionObj.playerId = PLAYERID;
    questionObj.playerList = GAME.GetPlayerList();
  
    GAME.state = "Question";

    if (QUESTIONINDEX == 0) {debug(`${GAME.gameId}: game has started`);}
  
    res.render("question", questionObj);
  };

  export {showQuestion}