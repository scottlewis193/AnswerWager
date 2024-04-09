import { IPlayerStore } from "./store";
import { Bet } from "./bets";
import { findClosestNumber, findClosestDate, debug, boolConv } from "../utils";
import { GAMESTORE } from "../server";
import moment from "moment";

function newPlayerStore() {
  return new playerStore();
}

class playerStore implements IPlayerStore {
  Players: Record<number, Player>;

  constructor() {
    this.Players = {};
  }
  getPlayers() {
    return this.Players;
  }

  createPlayer(playerId: number) {
    this.Players[playerId] = new Player(playerId);
  }
  deletePlayer(playerId: number) {
    delete this.Players[playerId];
  }
  getPlayer(playerId: number) {
    return this.Players[playerId];
  }
  updatePlayerName(playerId: number, playerName: string) {
    this.Players[playerId].playerName = playerName;
  }
}

interface IPlayer {
  [key: string]: string;
}

class Player implements IPlayer {
  [k: string]: any;
  playerId: number;
  playerName: string;
  private _readyStatus: boolean;
  private _answeredStatus: boolean;
  private _wageredStatus: boolean;
  answer: string;
  bets: Bet[];
  points: number;
  exactCorrectAnswers: number;
  correctAnswers: number;
  pointsEarnedRound: number;
  mostPointsEarnedRound: number;
  highestOddsWon: number;
  updateRequired: boolean;
  smallerWagered: boolean;

  set readyStatus(readyStatus: boolean) {
    this._readyStatus = readyStatus;

    const GAME = GAMESTORE.getPlayersGame(this.playerId);
    //trigger UI update for all others players
    GAME.updateUI(this.playerId);
    //update games ready status if all players are ready
    GAME.updateReadyStatus();
  }
  get readyStatus() {
    return this._readyStatus;
  }

  set answeredStatus(answeredStatus: boolean) {
    this._answeredStatus = answeredStatus;

    const GAME = GAMESTORE.getPlayersGame(this.playerId);
    //trigger UI update for all others players
    GAME.updateUI(this.playerId);
    //update games answered status if all players have answered
    GAME.updateAnsweredStatus();
  }
  get answeredStatus() {
    return this._answeredStatus;
  }

  set wageredStatus(wageredStatus: boolean) {
    this._wageredStatus = wageredStatus;

    const GAME = GAMESTORE.getPlayersGame(this.playerId);
    //trigger UI update for all others players
    GAME.updateUI(this.playerId);
    //update games wagered status if all players have wagered
    GAME.updateWageredStatus();
  }
  get wageredStatus() {
    return this._wageredStatus;
  }

  constructor(playerId: number) {
    (this.playerId = playerId),
      (this.playerName = ""),
      (this._readyStatus = false),
      (this._answeredStatus = false),
      (this._wageredStatus = false),
      (this.answer = ""),
      (this.bets = []),
      (this.points = 5),
      (this.pointsEarnedRound = 0),
      (this.exactCorrectAnswers = 0),
      (this.correctAnswers = 0),
      (this.mostPointsEarnedRound = 0),
      (this.highestOddsWon = 0),
      (this.updateRequired = false),
      (this.smallerWagered = false);
  }

  isHostOfGame() {
    var isHost = GAMESTORE.getPlayersGame(this.playerId).isHost(this.playerId);
    return isHost;
  }

  updatePlayerFromBody(body: any) {
    for (let [k, v] of Object.entries(this)) {
      const propName = k.replace("_", "");
      if (typeof body[propName] !== "undefined" && propName != "playerId") {
        //if (k.includes("_")) {
        this[propName] =
          body[propName] == "true" || body[propName] == "false"
            ? boolConv(body[propName])
            : body[propName];

        console.log(this[propName]);
        //} else {
        // v = body[propName];
        // }
      }
    }
  }

  updatePlayerName(playerName: string) {
    this.playerName = playerName;
  }

  getBetAnswers() {
    return this.bets.map((bet) => bet.answer);
  }

  calculateScore() {
    const GAME = GAMESTORE.getPlayersGame(this.playerId);
    const answers = GAME.getAnswers();

    const correctAnswer = Number(GAME.questions[GAME.questionIndex].answer);

    const closestAnswer = findClosestNumber(
      answers.map((answer) => Number(answer)),
      Number(correctAnswer)
    );

    var pointsWagered: number = 0;
    var hasWinningBet: boolean = false;

    //if player wagered correct answer then add points
    for (const bet of this.bets) {
      // -infinity represents SMALLER
      if (
        Number(bet.answer) == closestAnswer ||
        (bet.answer == "SMALLER" && closestAnswer == -Infinity)
      ) {
        this.points += bet.amount * bet.odds;
        this.pointsEarnedRound = bet.amount * bet.odds;
        hasWinningBet = true;

        if (bet.odds > this.highestOddsWon) {
          this.highestOddsWon = bet.odds;
        }
      }
      pointsWagered += bet.amount;
    }

    var hasSubmittedWinningAnswer: boolean = false;
    //if player submitted closest winning answer
    if (Number(this.answer) == closestAnswer) {
      this.correctAnswers += 1;
      this.points += 3;
      this.pointsEarnedRound += 3;

      if (Number(this.answer) == correctAnswer) {
        this.exactCorrectAnswers += 1;
        this.points += 3;
        this.pointsEarnedRound += 3;
      }

      hasSubmittedWinningAnswer = true;
    }

    //if player did not bet on winning answer and did not submit winning answer then subtract points from points earned stat
    if (!hasWinningBet && !hasSubmittedWinningAnswer) {
      this.pointsEarnedRound -= pointsWagered;
    }

    //store most points earned in a round
    if (this.pointsEarnedRound > this.mostPointsEarnedRound) {
      this.mostPointsEarnedRound = this.pointsEarnedRound;
    }

    //if player has no points after wagering then set to 1
    if (this.points == 0) {
      this.points = 1;
    }

    return `${this.playerName} - ${this.points} (${
      this.pointsEarnedRound > 0
        ? "+" + this.pointsEarnedRound
        : this.pointsEarnedRound
    })`;
  }

  resetPlayerForRound() {
    this.bets = [];
    this.wageredStatus = false;
    this.answeredStatus = false;
    this.answer = "";
    this.pointsEarnedRound = 0;
    this.smallerWagered = false;
  }

  resetPlayerForGame() {
    this.resetPlayerForRound();
    this.points = 5;
    this.exactCorrectAnswers = 0;
    this.correctAnswers = 0;
    this.mostPointsEarnedRound = 0;
    this.highestOddsWon = 0;
    this.updateRequired = false;
  }
}

export { newPlayerStore, playerStore, IPlayerStore, Player };
