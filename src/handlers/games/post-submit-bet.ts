const submitBet = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const BET = String(req.query.bet);
    //aw.players[PLAYERID].bet = BET;
    res.sendStatus(204);
  }