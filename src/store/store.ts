import { WebSocket } from "ws";

interface IPlayerStore {
    CreatePlayer: (playerId: number) => void;
    DeletePlayer: (playerId: number) => void;
    GetPlayer: (playerId: number) => Player;
    UpdatePlayerName: (playerId: number, playerName: string) => void;
}

type Player = {
  playerId: number;
  playerName: string;
  readyStatus: boolean;
  answeredStatus: boolean;
  answers: Answer[];
  wageredStatus: boolean;
  points: number;
  exactCorrectAnswers: number;
  correctAnswers: number;
  mostPointsEarnedRound: number;
  highestOddsWon: string;
}

interface IGameStore {
  CreateGame: (hostPlayerId: number) => void;
  DeleteGame: (gameId: number) => void;
  GetGame: (gameId: number) => Game;
  GetAnswers: (gameId: number) => Answer[];

  UpdateGameState: (gameId: number, state: string) => void;
  PlayersAnswered: (gameId: number) => boolean;
  UpdateAllPlayersAnsweredStatus: (gameId: number) => void;
  UpdateAllPlayersWageredStatus: (gameId: number) => void;
  UpdateAllPlayersReadyStatus: (gameId: number) => void;
}

type Game = {
  gameId: number;
  hostPlayerId: number;
  playerIds: number[];
  playersReady: boolean;
  playersAnswered: boolean;
  state: string;
  hasProcessedAnswers: boolean;
  processedAnswers: BoardAnswer[];
  questions: Question[];
  questionIndex: number;
  getPlayerList: () => Record<number, Player>;
}








interface AWWebSocket extends WebSocket  {
    id: number;
}


interface PlayerVars {
    playerId?: number;
    playerName?: string;
    readyStatus?: boolean;
}

export {
    IPlayerStore,
    IGameStore,
    Player,
    Game,
    AWWebSocket,
    PlayerVars}
  