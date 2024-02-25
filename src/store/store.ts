import { WebSocket } from "ws";
import { Question } from "./questions";
import { Answer } from "./answers";
import { Game } from "./games";
import { Player } from "./players";

interface IPlayerStore {
    CreatePlayer: (playerId: number) => void;
    DeletePlayer: (playerId: number) => void;
    GetPlayer: (playerId: number) => Player;

}

interface IGameStore {
  CreateGame: (hostPlayerId: number) => void;
  DeleteGame: (gameId: number) => void;
  GetGame: (gameId: number) => Game;
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
    AWWebSocket,
    PlayerVars
}
  