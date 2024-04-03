import { IPlayerStore } from "./store";
import { Answer } from "./answers";
import { Bet } from "./bets";
import { findClosestNumber } from "../utils";
import { GAMESTORE } from "../server";

function newPlayerStore() {
  return new playerStore();
}

class playerStore implements IPlayerStore {
  Players: Record<number, Player>;

  constructor() {
    this.Players = {};
  }
  getPlayerList() {
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

class Player {
  playerId: number;
  playerName: string;
  readyStatus: boolean;
  answeredStatus: boolean;
  answer: Answer;
  wageredStatus: boolean;
  bets: Bet[];
  points: number;
  exactCorrectAnswers: number;
  correctAnswers: number;
  pointsEarnedRound: number;
  mostPointsEarnedRound: number;
  highestOddsWon: number;
  updateRequired: boolean;

  constructor(playerId: number) {
    (this.playerId = playerId),
      (this.playerName = ""),
      (this.readyStatus = false),
      (this.answeredStatus = false),
      (this.answer = { playerId: 0, answer: 0, answerType: "" }),
      (this.wageredStatus = false),
      (this.bets = []),
      (this.points = 5),
      (this.pointsEarnedRound = 0),
      (this.exactCorrectAnswers = 0),
      (this.correctAnswers = 0),
      (this.mostPointsEarnedRound = 0),
      (this.highestOddsWon = 0),
      (this.updateRequired = false);
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
      answers.map((answer) => Number(answer.answer)),
      correctAnswer
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
        this.points = bet.amount * bet.odds;
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
    if (this.answer.answer == closestAnswer) {
      this.correctAnswers += 1;
      this.points += 3;
      this.pointsEarnedRound += 3;

      if (this.answer.answer == correctAnswer) {
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
    this.answer = { playerId: 0, answer: 0, answerType: "" };
    this.pointsEarnedRound = 0;
  }
}

export { newPlayerStore, playerStore, IPlayerStore, Player };
