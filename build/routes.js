import { connectRoute, createGame, joinGame, getPlayerList, leaveGame, submitAnswer, showQuestion, disconnectHostLeaves, checkReadyStatus, checkAnsweredStatus, getGameRules, updatePlayer, loadQuestions, submitBet } from "./handlers.js";
import { debug } from "./utils.js";
import multer from "multer";
import express from "express";
const router = express.Router();
const upload = multer({ dest: "./uploads" }).single("file");
router.use((req, res, next) => {
    next();
    //utils.writeLog();
});
router.get("/", (req, res) => {
    res.render("base");
});
router.get("/connect", (req, res) => {
    debug(req.query);
    connectRoute(req, res);
});
router.get("/games/create", (req, res) => {
    createGame(req, res);
});
router.get("/games/join", (req, res) => {
    joinGame(req, res);
});
router.get("/games/:gameId/playerlist", (req, res) => {
    getPlayerList(req, res);
});
router.post("/games/:gameId/loadquestions", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            debug(err);
            return res.status(400).send("a error occured uploading the file");
        }
        loadQuestions(req, res);
    });
});
router.get("/games/disconnect", (req, res) => {
    disconnectHostLeaves(req, res);
});
router.get("/games/:gameId/leave", (req, res) => {
    leaveGame(req, res);
});
router.get("/games/:gameId/submitanswer", (req, res) => {
    submitAnswer(req, res);
});
router.get("/games/:gameId/submitbet", (req, res) => {
    submitBet(req, res);
});
router.get("/games/:gameId/start", (req, res) => {
    showQuestion(req, res);
});
router.get("/games/:gameId/readycheck", (req, res) => {
    checkReadyStatus(req, res);
});
router.get("/games/:gameId/answercheck", (req, res) => {
    checkAnsweredStatus(req, res);
});
router.get("/game-rules", (req, res) => {
    getGameRules(req, res);
});
router.get("/players/:playerId/update", (req, res) => {
    updatePlayer(req, res);
});
export default router;
