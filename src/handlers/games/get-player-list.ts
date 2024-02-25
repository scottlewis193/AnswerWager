const getPlayerList = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
  
    var playerList : Players = utils.getPlayerList(GAMEID);
  
  
  
    //if player list returns nothing assume game no longer exists and boot client back to main menu
    if (Object.keys(playerList).length == 0) {
      res.render("disconnect", { playerId: PLAYERID });
    } else {
      //return and render player list
      res.render("player-list", { playerList: playerList, gameId: GAMEID });
    }
  };