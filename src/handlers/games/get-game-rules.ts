

const getGameRules = (req : express.Request, res : express.Response) => {
    const PLAYERID = req.query.playerId;
  
    res.render("game-rules", { playerId: PLAYERID });
  };