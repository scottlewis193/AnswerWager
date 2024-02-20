import { WebSocket } from "ws";

//INTERFACES

type Games = Record<string, Game>;

interface Game {
  hostPlayerId: string;
  playerIds: string[];
  playersReady: boolean;
  playersAnswered: boolean;
  state: string;
  processedAnswers: BoardAnswers;
  questions: Questions;
  questionIndex: number;
}

type Players = Record<string, Player>;

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
  playerId?: string;
  playerName?: string;
  readyStatus?: boolean;
}

type Answers = Answer[];

interface Answer {
  answer: string | number ;
  answerType: string;
}

type BoardAnswers = BoardAnswer[];

interface BoardAnswer {
  answer: string | number;
  odds: string;
}


type Questions = Question[];

interface Question {
  question: string;
  imageURL: string;
  answerType: string;
  answer: string | number;
  gameId: string;
  playerId: string;
}

type JSONCSV = Record<number, string | number>;

interface AWWebSocket extends WebSocket  {

  id: string;
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