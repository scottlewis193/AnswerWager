import * as aw from "./app.js";
import * as utils from "./utils.js";
import { debug } from "./utils.js";
const connect = (socketid) => {
    //add player to players obj
    aw.players[socketid] = utils.newPlayerObj();
};
const connectRoute = (req, res) => {
    const PLAYERID = Number(req.query.playerId);
    res.render("main-menu", {
        playerId: String(PLAYERID),
    });
    //check if playerName exists in req.query and if so set it
    if (req.query.hasOwnProperty("playerName"))
        aw.players[PLAYERID].playerName = String(req.query.playerName);
};
const disconnect = (socketid) => {
    //remove player from players object
    delete aw.players[socketid];
    //check if player has hosted any games and remove if needed
    //also check if player has joined any games and remove them from connected players
    for (const [gameId, game] of Object.entries(aw.games)) {
        if (game.hostPlayerId == socketid) {
            delete aw.games[Number(gameId)];
            break;
        }
        if (game.playerIds.indexOf(socketid) !== -1) {
            game.playerIds.splice(game.playerIds.indexOf(socketid), 1);
            break;
        }
    }
};
const disconnectHostLeaves = (req, res) => {
    const PLAYERID = req.query.playerId;
    const PLAYERNAME = req.query.playerName;
    res.render("main-menu", { playerId: PLAYERID, playerName: PLAYERNAME });
};
const createGame = (req, res) => {
    const NEWGAMEID = utils.generateId();
    const PLAYERID = Number(req.query.playerId);
    const PLAYERNAME = req.query.playerName;
    //add game info to games object
    aw.games[NEWGAMEID] = utils.newGameObj(PLAYERID);
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
const joinGame = (req, res) => {
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
const leaveGame = (req, res) => {
    const GAMEID = Number(req.query.gameId);
    const PLAYERID = Number(req.query.playerId);
    //remove player from array of playerids in game
    aw.games[GAMEID].playerIds.splice(aw.games[GAMEID].playerIds.indexOf(PLAYERID), 1);
    //check if player is hosting game and if so, remove game from obj
    if (aw.games[GAMEID].hostPlayerId == PLAYERID) {
        delete aw.games[GAMEID];
    }
    res.render("main-menu", {
        playerId: PLAYERID,
        playerName: req.query.playerName,
    });
};
const getPlayerList = (req, res) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    var playerList = utils.getPlayerList(GAMEID);
    //if player list returns nothing assume game no longer exists and boot client back to main menu
    if (Object.keys(playerList).length == 0) {
        res.render("disconnect", { playerId: PLAYERID });
    }
    else {
        //return and render player list
        res.render("player-list", { playerList: playerList, gameId: GAMEID });
    }
};
const submitAnswer = (req, res) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
    const SUBMITTEDANSWER = String(req.query.submittedAnswer);
    aw.players[PLAYERID].answeredStatus = true;
    aw.players[PLAYERID].answers[QUESTIONINDEX] = { answer: SUBMITTEDANSWER, answerType: '' };
    utils.updateAllPlayersAnsweredStatus();
    res.sendStatus(204);
};
const submitBet = (req, res) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const BET = String(req.query.bet);
    //aw.players[PLAYERID].bet = BET;
    res.sendStatus(204);
};
const checkReadyStatus = (req, res) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
    utils.updateAllPlayersReadyStatus();
    //if player is host then show start button
    if (utils.isHost(PLAYERID, aw.games[GAMEID])) {
        res.render("start-btn", {
            gameId: GAMEID,
            playersReady: aw.games[GAMEID].playersReady,
        });
    }
    else {
        //if all players are ready and game has started then show question
        if (aw.games[GAMEID].state == "Question" && aw.games[GAMEID].playersReady) {
            let questionObj = aw.games[GAMEID].questions[QUESTIONINDEX];
            questionObj.gameId = GAMEID;
            questionObj.playerId = PLAYERID;
            //add HX-Retarget to question so replaces the contents of the center div
            res.set("HX-Retarget", ".content");
            res.render("question", questionObj);
            return;
        }
        //send empty response if all players aren't ready or game hasn't started
        res.sendStatus(204);
    }
};
const checkAnsweredStatus = (req, res) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    utils.updateAllPlayersAnsweredStatus();
    if (aw.games[GAMEID].playersAnswered) {
        //process answers
        let PROCESSEDANSWERS;
        // debug(aw.games[GAMEID].processedAnswers)
        // if (aw.games[GAMEID].hasProcessedAnswers) {
        //   PROCESSEDANSWERS = aw.games[GAMEID].processedAnswers
        // } else {
        PROCESSEDANSWERS = utils.processAnswers(utils.getAnswers(GAMEID));
        aw.games[GAMEID].hasProcessedAnswers = true;
        // }
        //render wager board
        res.render("wager-board", {
            answers: PROCESSEDANSWERS,
            highestodds: utils.getHighestOdds(PROCESSEDANSWERS),
            playerId: PLAYERID,
            gameId: GAMEID,
            playerList: utils.getPlayerList(GAMEID),
        });
        return;
    }
    //send empty response if all players haven't submitted an answer
    res.sendStatus(204);
    //utils.drawDebug();
};
const getGameRules = (req, res) => {
    const PLAYERID = req.query.playerId;
    res.render("game-rules", { playerId: PLAYERID });
};
const updatePlayer = (req, res) => {
    var playerVars = req.query;
    playerVars.playerId = Number(req.params.playerId);
    //ready/unready btn
    if (req.query.hasOwnProperty("readyStatus")) {
        aw.players[playerVars.playerId].readyStatus = utils.boolConv(String(req.query.readyStatus));
        playerVars.readyStatus = utils.boolConv(String(req.query.readyStatus));
        utils.updateAllPlayersReadyStatus();
        res.render("ready-btn", playerVars);
    }
};
const loadQuestions = async (req, res) => {
    const GAMEID = Number(req.params.gameId);
    const QUESTIONFILE = req.file.path;
    aw.games[GAMEID].questions = await utils.CSVToJSON(QUESTIONFILE);
    return res.status(200).send("Successfully uploaded files");
};
const showQuestion = (req, res) => {
    const GAMEID = Number(req.params.gameId);
    const PLAYERID = Number(req.query.playerId);
    const QUESTIONINDEX = aw.games[GAMEID].questionIndex;
    let questionObj = aw.games[GAMEID].questions[QUESTIONINDEX];
    questionObj.gameId = GAMEID;
    questionObj.playerId = PLAYERID;
    questionObj.playerList = utils.getPlayerList(GAMEID);
    aw.games[GAMEID].state = "Question";
    debug(questionObj);
    res.render("question", questionObj);
};
export { connect, connectRoute, disconnect, createGame, joinGame, leaveGame, updatePlayer, getPlayerList, disconnectHostLeaves, checkReadyStatus, checkAnsweredStatus, getGameRules, submitAnswer, showQuestion, loadQuestions, submitBet };
