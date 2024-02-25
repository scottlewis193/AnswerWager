const joinGame = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.get("HX-Prompt"));
    const PLAYERID = Number(req.query.playerId); 
    const PLAYERNAME = req.query.playerName;
  
    aw.games[GAMEID].playerIds.push(PLAYERID);
  
    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYERID,
      gameId: GAMEID,
      playerName: PLAYERNAME,
      isHost: false,
    });
  };