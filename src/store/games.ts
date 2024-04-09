import { findClosestNumber, findClosestDate, generateId } from "../utils";
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
}

class Game {
  gameId: number;
  hostPlayerId: number;
  playerIds: number[];
  playersReady: boolean;
  playersAnswered: boolean;
  playersWagered: boolean;
  _state: number;
  hasProcessedAnswers: boolean;
  processedAnswers: BoardAnswer[];
  highestOdds: number;
  hasProcessedBets: boolean;
  hasCalculatedScores: boolean;
  questions: Question[];
  questionIndex: number;
  revealAnswer: boolean;

  constructor(gameId: number, hostPlayerId: number) {
    (this.gameId = gameId),
      (this.hostPlayerId = hostPlayerId),
      (this.playerIds = [hostPlayerId]),
      (this.playersReady = false),
      (this.playersAnswered = false),
      (this.playersWagered = false),
      (this._state = 0),
      (this.hasProcessedAnswers = false),
      (this.processedAnswers = []),
      (this.highestOdds = 0),
      (this.hasProcessedBets = false),
      (this.hasCalculatedScores = false),
      (this.questions = []),
      (this.questionIndex = 0),
      (this.revealAnswer = false);
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
    this._state += 1;
  }

  getGameState() {
    return GAMESTATES[this._state];
  }
  /**
   * update the game's state
   * @param state "preGameLobby" | "Question" | "Wagering" | "AnswerReveal" | "Scores" | "FinalScores"
   *
   */
  setGameState(state: string) {
    const NEWSTATE = GAMESTATES.indexOf(state);
    if (NEWSTATE >= 0) {
      this._state = NEWSTATE;
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

  updateUI(triggeredPlayerId: number) {
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
    this.questionIndex += 1;
    this.playersAnswered = false;
    this.playersWagered = false;
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
