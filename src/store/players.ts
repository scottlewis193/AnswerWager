import { IPlayerStore } from "./store";
import { Player } from "./store";

function NewPlayerStore() {
    return new PlayerStore();
}

class PlayerStore implements IPlayerStore {
    Players: Record<number, Player>

    constructor() {
        this.Players = {};

    }
    GetPlayerList() {
        return this.Players
    }
   
    CreatePlayer(playerId: number) {
        this.Players[playerId] =  {
            playerId: playerId,
            playerName: "",
            readyStatus: false,
            answeredStatus: false,
            answers: [],
            wageredStatus: false,
            points: 5,
            exactCorrectAnswers: 0,
            correctAnswers: 0,
            mostPointsEarnedRound: 0,
            highestOddsWon: "",
          };
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

export {NewPlayerStore, PlayerStore, IPlayerStore} 
