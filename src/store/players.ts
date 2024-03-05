import { IPlayerStore } from "./store";
import { Answer } from "./answers";
import { Bet } from "./bets";
import { gameStore, playerStore } from "../server";
import { findClosestNumber } from "../utils";

function NewPlayerStore() {
  return new PlayerStore();
}

class PlayerStore implements IPlayerStore {
  Players: Record<number, Player>;

  constructor() {
    this.Players = {};
  }
  GetPlayerList() {
    return this.Players;
  }

  CreatePlayer(playerId: number) {
    this.Players[playerId] = new Player(playerId);
  }
  DeletePlayer(playerId: number) {
    delete this.Players[playerId];
  }
  GetPlayer(playerId: number) {
    return this.Players[playerId];
  }
  UpdatePlayerName(playerId: number, playerName: string) {
    this.Players[playerId].playerName = playerName;
  }
}

class Player {
  playerId: number;
  playerName: string;
  readyStatus: boolean;
  answeredStatus: boolean;
  answers: Answer[];
  wageredStatus: boolean;
  bets: Bet[];
  points: number;
  exactCorrectAnswers: number;
  correctAnswers: number;
  mostPointsEarnedRound: number;
  highestOddsWon: number;
  updateRequired: boolean;

  constructor(playerId: number) {
    (this.playerId = playerId),
      (this.playerName = ""),
      (this.readyStatus = false),
      (this.answeredStatus = false),
      (this.answers = []),
      (this.wageredStatus = false),
      (this.bets = []),
      (this.points = 5),
      (this.exactCorrectAnswers = 0),
      (this.correctAnswers = 0),
      (this.mostPointsEarnedRound = 0),
      (this.highestOddsWon = 0),
      (this.updateRequired = false);
  }

  UpdatePlayerName(playerName: string) {
    this.playerName = playerName;
  }

  GetBetAnswers() {
    return this.bets.map((bet) => bet.answer);
  }

  calculateScore() {
    const GAME = gameStore.GetPlayersGame(this.playerId);
    const answers = GAME.GetAnswers();
    const correctAnswer = Number(GAME.questions[GAME.questionIndex].answer);
    const closestAnswer = findClosestNumber(
      answers.map((answer) => Number(answer.answer)),
      correctAnswer
    );

    var pointsEarnedRound: number = 0;
    var pointsWagered: number = 0;

    //if player wagered correct answer then add points
    for (const bet of this.bets) {
      if (Number(bet.answer) == closestAnswer) {
        this.points = bet.amount * bet.odds;
        pointsEarnedRound = bet.amount * bet.odds;

        if (bet.odds > this.highestOddsWon) {
          this.highestOddsWon = bet.odds;
        }
      }

      pointsWagered += bet.amount;
    }

    //if player submitted closest winning answer
    if (this.answers[GAME.questionIndex].answer == closestAnswer) {
      this.correctAnswers += 1;
      this.points += 3;
      pointsEarnedRound += 3;

      if (this.answers[GAME.questionIndex].answer == correctAnswer) {
        this.exactCorrectAnswers += 1;
        this.points += 3;
        pointsEarnedRound += 3;
      }
    }

    if (pointsEarnedRound > this.mostPointsEarnedRound) {
      this.mostPointsEarnedRound = pointsEarnedRound;
    }

    return `${this.playerName} - ${this.points} (${
      pointsEarnedRound > 0 ? "+" + pointsEarnedRound : pointsEarnedRound
    })`;
  }
}

export { NewPlayerStore, PlayerStore, IPlayerStore, Player };
