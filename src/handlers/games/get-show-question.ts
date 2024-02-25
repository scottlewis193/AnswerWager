const showQuestion = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
    let questionObj = aw.games[GAMEID].questions[QUESTIONINDEX];
    questionObj.gameId = GAMEID;
    questionObj.playerId = PLAYERID;
    questionObj.playerList = utils.getPlayerList(GAMEID);
  
    aw.games[GAMEID].state = "Question";
    debug(questionObj)
  
    res.render("question", questionObj);
  };