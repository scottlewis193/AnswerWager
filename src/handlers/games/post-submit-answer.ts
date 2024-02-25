
const submitAnswer = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
    const SUBMITTEDANSWER = String(req.query.submittedAnswer);
  
    aw.players[PLAYERID].answeredStatus = true;
    aw.players[PLAYERID].answers[QUESTIONINDEX] = { answer: SUBMITTEDANSWER, answerType: '' };
  
    utils.updateAllPlayersAnsweredStatus();
  
    res.sendStatus(204);
  };