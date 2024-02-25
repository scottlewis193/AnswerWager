
const leaveGame = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.query.gameId); 
    const PLAYERID = Number(req.query.playerId); 
  
  //remove player from array of playerids in game
  aw.games[GAMEID].playerIds.splice(
    aw.games[GAMEID].playerIds.indexOf(PLAYERID),
    1
  );
  
    //check if player is hosting game and if so, remove game from obj
    if (aw.games[GAMEID].hostPlayerId == PLAYERID) {
      delete aw.games[GAMEID];
    }
  
    
  
    res.render("main-menu", {
      playerId: PLAYERID,
      playerName: req.query.playerName,
    });
  };