const updatePlayer = (req : express.Request, res : express.Response) => {
    var playerVars : PlayerVars = req.query;
    playerVars.playerId = Number(req.params.playerId);
  
    //ready/unready btn
    if (req.query.hasOwnProperty("readyStatus")) {
      aw.players[playerVars.playerId].readyStatus = utils.boolConv(
        String(req.query.readyStatus)
      );
      playerVars.readyStatus = utils.boolConv(String(req.query.readyStatus));
  
      utils.updateAllPlayersReadyStatus();
  
      res.render("ready-btn", playerVars);
    }
  };