import express from "express";
import { PlayerVars } from "../../store/store";
import { boolConv } from "../../utils";
import { playerStore } from "../../server";

const updatePlayer = (req : express.Request, res : express.Response) => {
    var playerVars : PlayerVars = req.query;
    playerVars.playerId = Number(req.params.playerId);
    const PLAYER = playerStore.Players[playerVars.playerId];
  
    //ready/unready btn
    if (req.query.hasOwnProperty("readyStatus")) {
      PLAYER.readyStatus = boolConv(
        String(req.query.readyStatus)
      );
      playerVars.readyStatus = boolConv(String(req.query.readyStatus));
  
      res.render("ready-btn", playerVars);
    }
  };

  export { updatePlayer }