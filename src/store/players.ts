import { IPlayerStore } from "./store";
import { Answer } from "./answers";
import { Bet } from "./bets";

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
        this.Players[playerId] = new Player(playerId) 
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

    playerId: number
    playerName: string
    readyStatus: boolean
    answeredStatus: boolean
    answers: Answer[]
    wageredStatus: boolean
    bets: Bet[]
    points: number
    exactCorrectAnswers: number
    correctAnswers: number
    mostPointsEarnedRound: number
    highestOddsWon: string
    updateRequired: boolean

    constructor(playerId: number) {
        this.playerId = playerId,
        this.playerName = "",
        this.readyStatus = false,
        this.answeredStatus = false,
        this.answers = [],
        this.wageredStatus = false,
        this.bets = [],
        this.points = 5,
        this.exactCorrectAnswers = 0,
        this.correctAnswers = 0,
        this.mostPointsEarnedRound = 0,
        this.highestOddsWon = "",
        this.updateRequired = false
    }

    UpdatePlayerName(playerName: string) {
        this.playerName = playerName;
    }

    GetBetAnswers() {
        return this.bets.map((bet) => bet.answer)
    }
}

export {NewPlayerStore, PlayerStore, IPlayerStore, Player} 
