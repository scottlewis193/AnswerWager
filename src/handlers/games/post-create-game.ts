const createGame = (req : express.Request, res : express.Response) => {
    const NEWGAMEID = utils.generateId();
    const PLAYERID = Number(req.query.playerId);
    const PLAYERNAME = req.query.playerName;
  
    //add game info to games object
    aw.games[NEWGAMEID] = utils.newGameObj(PLAYERID,NEWGAMEID);
  
    aw.games[NEWGAMEID].playerIds.push(PLAYERID);
  
    utils.drawDebug();
  
    //send game-lobby screen to client
    res.render("pre-game-lobby", {
      playerId: PLAYERID,
      gameId: NEWGAMEID,
      playerName: PLAYERNAME,
      isHost: true,
    });
  };