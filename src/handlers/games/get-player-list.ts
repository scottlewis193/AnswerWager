import express from "express";
import { gameStore } from "../../server";
import { Player } from "../../store/players";

const getPlayerList = (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const GAME = gameStore.Games[GAMEID];
    const PLAYERID = Number(req.query.playerId);
  
    var playerList : Record<number,Player> = GAME.GetPlayerList();
  
  
  
    //if player list returns nothing assume game no longer exists and boot client back to main menu
    if (Object.keys(playerList).length == 0) {
      res.render("disconnect", { playerId: PLAYERID });
    } else {
      //return and render player list
      res.render("player-list", { playerList: playerList, gameId: GAMEID });
    }
  };

  export {getPlayerList}