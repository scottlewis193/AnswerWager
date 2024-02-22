import { WebSocket } from "ws";

//INTERFACES

type Games = Record<number, Game>;

interface Game {
  hostPlayerId: number;
  playerIds: number[];
  playersReady: boolean;
  playersAnswered: boolean;
  state: string;
  hasProcessedAnswers: boolean;
  processedAnswers: BoardAnswers;
  questions: Questions;
  questionIndex: number;
}

type Players = Record<number, Player>;

interface Player {
  playerName: string;
  readyStatus: boolean;
  answeredStatus: boolean;
  answers: Answers;
  wageredStatus: boolean;
  points: number;
  exactCorrectAnswers: number;
  correctAnswers: number;
  mostPointsEarnedRound: number;
  highestOddsWon: string;
}

interface PlayerVars {
  playerId?: number;
  playerName?: string;
  readyStatus?: boolean;
}

type Answers = Record<number, Answer>;

interface Answer {
  answer: string | number ;
  answerType: string;
}

type Bets = Record<number, Bet>;

interface Bet {
  playerId: number;
  amount: number;
}

type BoardAnswers = Record<number,BoardAnswer>;

interface BoardAnswer {
  answer: string | number;
  odds: string;
}


type Questions = Record<number,Question>;

interface Question {
  question: string;
  imageURL: string;
  answerType: string;
  answer: string | number;
  gameId: number;
  playerId: number;
  playerList: Players;
}

type JSONCSV = Record<number, string | number>;

interface AWWebSocket extends WebSocket  {

  id: number;
}

export {
  Games,
  Game,
  Players,
  Player,
  PlayerVars,
  Answers,
  Answer,
  BoardAnswers,
  BoardAnswer,
  Questions,
  Question,
  JSONCSV,
  AWWebSocket}