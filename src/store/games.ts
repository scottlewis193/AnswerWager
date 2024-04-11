import {
  findClosestNumber,
  findClosestDate,
  generateId,
  boolConv,
  debug,
} from "../utils";
import { GAMESTATES, PLAYERSTORE } from "../server";
import { IGameStore, IPlayerStore } from "./store";
import { BoardAnswer } from "./answers";
import { Question } from "./questions";
import { getMiddleIndex } from "../utils";
import { Player } from "./players";
import moment from "moment";

function newGameStore() {
  return new gameStore();
}

class gameStore implements IGameStore {
  Games: Record<number, Game>;

  constructor() {
    this.Games = {};
  }

  getPlayersGame(playerId: number) {
    for (const gameId in this.Games) {
      if (this.Games[gameId].playerIds.includes(playerId)) {
        return this.Games[gameId];
      }
    }
    return new Game(0, 0);
  }

  createGame(hostPlayerId: number) {
    const NEWGAMEID = generateId();
    this.Games[NEWGAMEID] = new Game(NEWGAMEID, hostPlayerId);
    return NEWGAMEID;
  }

  deleteGame(gameId: number) {
    delete this.Games[gameId];
  }

  getGame(gameId: number) {
    return this.Games[gameId];
  }

  getGameByIndex(index: number) {
    return Object.values(this.Games)[index];
  }
}

interface IGame {
  [key: string]: string;
}

class Game implements IGame {
  [k: string]: any;
  gameId: number;
  hostPlayerId: number;
  playerIds: number[];
  hasProcessedAnswers: boolean;
  processedAnswers: BoardAnswer[];
  highestOdds: number;
  hasProcessedBets: boolean;
  hasCalculatedScores: boolean;
  questions: Question[];
  questionIndex: number;

  //privates
  private _playersReady: boolean;
  private _playersAnswered: boolean;
  private _playersWagered: boolean;
  private _revealedAnswer: boolean;
  private _roundEnd: boolean;
  private _state: number;

  get roundEnd() {
    return this._roundEnd;
  }

  set roundEnd(roundEnd: boolean) {
    if (roundEnd && this._roundEnd !== roundEnd) {
      this._roundEnd = roundEnd;
      this.resetGameForRound();

      //IF END OF GAME, SET FINAL SCORES STATE
      if (this.questionIndex > this.questions.length - 1) {
        this.setGameStateFromStr("FinalScores");
      } else {
        //IF NOT END OF GAME, SET QUESTION STATE
        this.setGameStateFromStr("Question");
      }
    } else {
      this._roundEnd = roundEnd;
    }
  }

  get state() {
    return this._state;
  }

  set state(state: number) {
    const NEWSTATE = GAMESTATES[state];
    if (NEWSTATE !== undefined) {
      this._state = state;
    }
  }

  get playersAnswered() {
    return this._playersAnswered;
  }

  set playersAnswered(playersAnswered: boolean) {
    if (playersAnswered && this._playersAnswered !== playersAnswered) {
      this.processAnswers();
      this.setGameStateFromStr("Wagering");
      debug(
        `${this.gameId}: all players have answered question ${this.questionIndex}`
      );
      this.updateUI();
    }
    this._playersAnswered = playersAnswered;
  }

  get playersWagered() {
    return this._playersWagered;
  }

  set playersWagered(playersWagered: boolean) {
    if (playersWagered && this._playersWagered !== playersWagered) {
      this.calculateScores();
      this.setGameStateFromStr("AnswerReveal");
      debug(
        `${this.gameId}: all players have finished wagering (${this.questionIndex})`
      );
      this.updateUI();
    }
    this._playersWagered = playersWagered;
  }

  get playersReady() {
    return this._playersReady;
  }

  set playersReady(playersReady: boolean) {
    if (playersReady && this._playersReady !== playersReady) {
      this.updateUI(this.hostPlayerId);
    }
    this._playersReady = playersReady;
  }

  get revealedAnswer() {
    return this._revealedAnswer;
  }

  set revealedAnswer(revealedAnswer: boolean) {
    if (revealedAnswer && this._revealedAnswer !== revealedAnswer) {
      this.setGameStateFromStr("Scores");
      this.updateUI(this.hostPlayerId);
    }

    this._revealedAnswer = revealedAnswer;
  }
  constructor(gameId: number, hostPlayerId: number) {
    (this.gameId = gameId),
      (this.hostPlayerId = hostPlayerId),
      (this.playerIds = [hostPlayerId]),
      (this._playersReady = false),
      (this._playersAnswered = false),
      (this._playersWagered = false),
      (this._state = 0),
      (this.hasProcessedAnswers = false),
      (this.processedAnswers = []),
      (this.highestOdds = 0),
      (this.hasProcessedBets = false),
      (this.hasCalculatedScores = false),
      (this._roundEnd = false),
      (this.questions = []),
      (this.questionIndex = 0),
      (this._revealedAnswer = false);
  }

  /**
   * iterates over the player ids and returns an array of players
   * @returns array of players
   */
  getPlayers() {
    let playerList: Player[] = [];

    for (const playerId of this.playerIds) {
      playerList.push(PLAYERSTORE.getPlayer(playerId));
    }
    return playerList;
  }

  /**
   * update the game's state
   * @param state "preGameLobby" | "Question" | "Wagering" | "AnswerReveal" | "Scores" | "FinalScores"
   *
   */
  updateGameState() {
    this.state += 1;
  }

  getGameStateStr() {
    return GAMESTATES[this.state];
  }
  /**
   * update the game's state
   * @param state "preGameLobby" | "Question" | "Wagering" | "AnswerReveal" | "Scores" | "FinalScores"
   *
   */
  setGameStateFromStr(state: string) {
    const NEWSTATE = GAMESTATES.indexOf(state);
    if (NEWSTATE >= 0) {
      this.state = NEWSTATE;
    }
  }

  updateGameFromBody(body: any) {
    for (let propName of Object.keys(body)) {
      if (this[propName] !== "undefined" && propName != "playerId") {
        if (propName == "state") {
          this.setGameStateFromStr(body[propName]);
        } else {
          this[propName] =
            body[propName] == "true" || body[propName] == "false"
              ? boolConv(body[propName])
              : body[propName];
        }
      }
    }
  }

  /**
   * Update the game's `playersAnswered` flag to true if all players have answered
   * their question.
   */
  playersHaveAnswered() {
    return this.playersAnswered;
  }

  /**
   * Update the game's `playersAnswered` flag to true if all players have answered
   * their question.
   */
  updateAnsweredStatus() {
    this.playersAnswered = this.playerIds.every(
      (playerId) => PLAYERSTORE.getPlayer(playerId).answeredStatus
    );
  }
  /**
   * Update the game's `playersReady' flag to true if all players are ready
   */
  updateReadyStatus() {
    //set playersReady to true if all players are ready
    this.playersReady = this.playerIds.every(
      (playerId) => PLAYERSTORE.getPlayer(playerId).readyStatus
    );
  }
  /**
   * Update the game's `playersWagered' flag to true if all players have wagered
   */
  updateWageredStatus() {
    //set playersReady to true if all players are ready
    this.playersWagered = this.playerIds.every(
      (playerId) => PLAYERSTORE.getPlayer(playerId).wageredStatus
    );
  }

  getAnswer(answer: number | string) {
    const ANSWER = this.processedAnswers.find((a) => a.answer == answer);
    if (ANSWER != undefined) {
      return ANSWER;
    }
    return { answer: 0, odds: 2, wagered: false, correctAnswer: false };
  }

  /**
   * Set boardAnswers array with the answers and determine if they are correct.
   * For each answer in the answers array, create a new BoardAnswer object with
   * the answer, odds, wagered, and correctAnswer fields. The correctAnswer field
   * is set to true if the answer is equal to the closest number to the correct
   * answer.
   */
  processAnswers() {
    if (this.hasProcessedAnswers) {
      return;
    }

    const answers = this.getAnswers();

    let boardAnswers: BoardAnswer[] = [];

    // const correctAnswer =
    //   this.questions[this.questionIndex].answerType == "number"
    //     ? Number(this.questions[this.questionIndex].answer)
    //     : new Date(this.questions[this.questionIndex].answer).getTime();

    const correctAnswer = Number(this.questions[this.questionIndex].answer);

    const closestAnswer = findClosestNumber(
      answers.map((answer) => Number(answer)),
      Number(correctAnswer)
    );

    //set board answers and determine correct answer
    for (let index: number = 0; index < answers.length; index++) {
      boardAnswers[index] = {
        answer: answers[index],
        displayedAnswer:
          this.questions[this.questionIndex].answerType == "number"
            ? String(answers[index])
            : moment(answers[index], "x").toDate().toLocaleDateString("en-GB"),
        odds: 0,
        wagered: false,
        correctAnswer: Number(answers[index]) == closestAnswer,
      };
    }

    //determine BoardAnswers.answer that is closest to correctAnswer withiut going over

    const MIDDLEANSWERINDEX = getMiddleIndex(boardAnswers);
    const BORDERANSWERSCOUNT = Object.keys(boardAnswers).length;
    for (let index = 0; index < BORDERANSWERSCOUNT; index++) {
      if (index < MIDDLEANSWERINDEX) {
        const oddsnum = Math.abs(index - 2 - MIDDLEANSWERINDEX);
        boardAnswers[index].odds = oddsnum;
      }
      if (index == MIDDLEANSWERINDEX || BORDERANSWERSCOUNT == 1) {
        boardAnswers[index].odds = 2;
      }
      if (index > MIDDLEANSWERINDEX) {
        const oddsnum = index + 2 - MIDDLEANSWERINDEX;
        boardAnswers[index].odds = oddsnum;
      }
    }
    this.hasProcessedAnswers = true;
    this.processedAnswers = boardAnswers;
    this.highestOdds = this.getHighestOdds();
  }

  /**
   * iterates over the submitted answers, discards any duplicates and sorts the remaining answers from lowest to highest
   * @returns array of answers
   */
  getAnswers() {
    const QUESTIONINDEX = Number(this.questionIndex);

    let answers: string[] = [];

    for (const playerId of this.playerIds) {
      const PLAYERANSWER = PLAYERSTORE.getPlayer(playerId).answer;

      //aw.players[playerId].answers[QUESTIONINDEX].answer, answerType: '' };

      //if answer already exists, skip over it - to avoid duplicates

      let answersAry = answers;
      if (answersAry.includes(PLAYERANSWER)) {
        continue;
      }

      //add to processed answers
      answers.push(PLAYERANSWER);
    }

    //sort from lowest to highest
    answers = answers.sort((a, b) => {
      return Number(a) - Number(b);
    });

    return answers;
  }

  /**
   * determines if player is the host
   * @param playerId a player id
   * @returns true if the player is the host
   */
  isHost(playerId: number) {
    return playerId == this.hostPlayerId;
  }

  updateUI(triggeredPlayerId: number = 0) {
    for (const playerId of this.playerIds) {
      if (playerId == triggeredPlayerId) {
        continue;
      }
      PLAYERSTORE.getPlayer(playerId).updateRequired = true;
    }
  }

  getHighestOdds() {
    return Object.keys(this.processedAnswers).length !== 1
      ? getMiddleIndex(this.processedAnswers) + 3
      : 2;
  }

  calculateScores() {
    if (this.hasCalculatedScores) {
      return;
    }
    for (const playerId of this.playerIds) {
      PLAYERSTORE.Players[playerId].calculateScore();
    }
    this.hasCalculatedScores = true;
  }
  resetGameForRound() {
    //we set the privates heres to stop it from triggering the setters
    this._playersAnswered = false;
    this._playersWagered = false;
    this._revealedAnswer = false;
    this._roundEnd = false;

    this.questionIndex += 1;
    this.hasProcessedBets = false;
    this.hasProcessedAnswers = false;
    this.hasCalculatedScores = false;

    this.processedAnswers = [];

    for (const playerId of this.playerIds) {
      PLAYERSTORE.Players[playerId].resetPlayerForRound();
    }
  }

  resetPlayersForGame() {
    for (const playerId of this.playerIds) {
      PLAYERSTORE.Players[playerId].resetPlayerForGame();
    }
  }
}

export { newGameStore, Game };
