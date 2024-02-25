const checkReadyStatus = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
  
    utils.updateAllPlayersReadyStatus();
  
    //if player is host then show start button
    if (utils.isHost(PLAYERID, aw.games[GAMEID])) {
      res.render("start-btn", {
        gameId: GAMEID,
        playersReady: aw.games[GAMEID].playersReady,
      });
    } else {
      //if all players are ready and game has started then show question
      if (aw.games[GAMEID].state == "Question" && aw.games[GAMEID].playersReady) {
        let questionObj = aw.games[GAMEID].questions[QUESTIONINDEX];
        questionObj.gameId = GAMEID;
        questionObj.playerId = PLAYERID;
        //add HX-Retarget to question so replaces the contents of the center div
        res.set("HX-Retarget", ".content");
        res.render("question", questionObj);
        return;
      }
  
      //send empty response if all players aren't ready or game hasn't started
      res.sendStatus(204);
    }
  };