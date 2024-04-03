import { WebSocket } from "ws";
import { Question } from "./questions";
import { Answer } from "./answers";
import { Game } from "./games";
import { Player } from "./players";

interface IPlayerStore {
  createPlayer: (playerId: number) => void;
  deletePlayer: (playerId: number) => void;
  getPlayer: (playerId: number) => Player;
}

interface IGameStore {
  createGame: (hostPlayerId: number) => void;
  deleteGame: (gameId: number) => void;
  getGame: (gameId: number) => Game;
}

interface AWWebSocket extends WebSocket {
  id: number;
}

export { IPlayerStore, IGameStore, AWWebSocket };
