import { findClosestNumber, generateId } from "../utils";
import { playerStore } from "../server";
import { IGameStore, IPlayerStore } from "./store";
import { BoardAnswer, Answer } from "./answers";
import { Question } from "./questions";
import { getMiddleIndex } from "../utils";
import { Player } from "./players";

function NewGameStore() {
  return new GameStore();
}

class GameStore implements IGameStore {
  Games: Record<number, Game>;

  constructor() {
    this.Games = {};
  }

  GetPlayersGame(playerId: number) {
    for (const gameId in this.Games) {
      if (this.Games[gameId].playerIds.includes(playerId)) {
        return this.Games[gameId];
      }
    }
    return new Game(0, 0);
  }

  CreateGame(hostPlayerId: number) {
    const NEWGAMEID = generateId();
    this.Games[NEWGAMEID] = new Game(NEWGAMEID, hostPlayerId);
    return NEWGAMEID;
  }

  DeleteGame(gameId: number) {
    delete this.Games[gameId];
  }

  GetGame(gameId: number) {
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
  state: string;
  hasProcessedAnswers: boolean;
  processedAnswers: BoardAnswer[];
  hadProcessedBets: boolean;
  questions: Question[];
  questionIndex: number;

  constructor(gameId: number, hostPlayerId: number) {
    (this.gameId = gameId),
      (this.hostPlayerId = hostPlayerId),
      (this.playerIds = [hostPlayerId]),
      (this.playersReady = false),
      (this.playersAnswered = false),
      (this.playersWagered = false),
      (this.state = "preGameLobby"),
      (this.hasProcessedAnswers = false),
      (this.processedAnswers = []),
      (this.hadProcessedBets = false),
      (this.questions = []),
      (this.questionIndex = 0);
  }

  /**
   * iterates over the player ids and returns an array of players
   * @returns array of players
   */
  GetPlayerList() {
    let playerList: Player[] = [];

    for (const playerId of this.playerIds) {
      playerList.push(playerStore.GetPlayer(playerId));
    }
    return playerList;
  }

  /**
   * update the game's state
   * @param state "preGameLobby" | "Question"
   */
  UpdateGameState(state: string) {
    this.state = state;
  }

  /**
   * Update the game's `playersAnswered` flag to true if all players have answered
   * their question.
   */
  PlayersAnswered() {
    return this.playersAnswered;
  }

  /**
   * Update the game's `playersAnswered` flag to true if all players have answered
   * their question.
   */
  UpdateAnsweredStatus() {
    this.playersAnswered = this.playerIds.every(
      (playerId) => playerStore.GetPlayer(playerId).answeredStatus
    );
  }
  /**
   * Update the game's `playersReady' flag to true if all players are ready
   */
  UpdateReadyStatus() {
    //set playersReady to true if all players are ready
    this.playersReady = this.playerIds.every(
      (playerId) => playerStore.GetPlayer(playerId).readyStatus
    );
  }
  /**
   * Update the game's `playersWagered' flag to true if all players have wagered
   */
  UpdateWageredStatus() {
    //set playersReady to true if all players are ready
    this.playersWagered = this.playerIds.every(
      (playerId) => playerStore.GetPlayer(playerId).wageredStatus
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
  ProcessAnswers() {
    const answers = this.GetAnswers();

    let boardAnswers: BoardAnswer[] = [];
    const correctAnswer = Number(this.questions[this.questionIndex].answer);
    const closestAnswer = findClosestNumber(
      answers.map((answer) => Number(answer.answer)),
      correctAnswer
    );

    //set board answers and determine correct answer
    for (let index: number = 0; index < Object.keys(answers).length; index++) {
      boardAnswers[index] = {
        answer: answers[index].answer,
        odds: 0,
        wagered: false,
        correctAnswer: answers[index].answer == closestAnswer,
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
  }

  /**
   * iterates over the submitted answers, discards any duplicates and sorts the remaining answers from lowest to highest
   * @returns array of answers
   */
  GetAnswers() {
    const QUESTIONINDEX = Number(this.questionIndex);

    let answers: Answer[] = [];

    for (const playerId of this.playerIds) {
      const PLAYERANSWER: Answer = {
        playerId: playerId,
        answer: playerStore.GetPlayer(playerId).answer.answer,
        answerType: "",
      }; //aw.players[playerId].answers[QUESTIONINDEX].answer, answerType: '' };

      //if answer already exists, skip over it - to avoid duplicates

      let answersAry = Object.values(answers);
      if (answersAry.includes(PLAYERANSWER)) {
        continue;
      }

      //add to processed answers
      answers.push(PLAYERANSWER);
    }

    //sort from lowest to highest
    answers = answers.sort((a, b) => {
      return Number(a.answer) - Number(b.answer);
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

  updateLobbyUI(triggeredPlayerId: number) {
    for (const playerId of this.playerIds) {
      if (playerId == triggeredPlayerId) {
        continue;
      }
      playerStore.GetPlayer(playerId).updateRequired = true;
    }
  }

  calculateScores() {
    for (const playerId of this.playerIds) {
      playerStore.Players[playerId].calculateScore();
    }
  }
  resetGameForRound() {
    this.questionIndex += 1;
    this.playersAnswered = false;
    this.playersWagered = false;
    this.hadProcessedBets = false;
    this.hasProcessedAnswers = false;
    this.processedAnswers = [];

    for (const playerId of this.playerIds) {
      playerStore.Players[playerId].resetPlayerForRound();
    }
  }
}

export { NewGameStore, GameStore, Game };
