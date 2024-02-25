import express from "express";

const disconnectHostLeaves = (req : express.Request, res : express.Response) => {
    const PLAYERID = req.query.playerId;
    const PLAYERNAME = req.query.playerName;
  
    //render main menu
    res.render("main-menu", { playerId: PLAYERID, playerName: PLAYERNAME });
  };

  export {disconnectHostLeaves}