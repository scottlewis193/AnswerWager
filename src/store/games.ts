
import { generateId } from "../utils";
import { playerStore } from "../server";
import {  IGameStore,IPlayerStore } from "./store";
import { Game,Player } from "../store/store";

function NewGameStore() {
    return new GameStore();
}

class GameStore implements IGameStore {

    Games: Record<number, Game>

    constructor() {
        this.Games = {};
    }

    CreateGame(hostPlayerId: number) {
        const NEWGAMEID = generateId();
        this.Games[NEWGAMEID] = {
            gameId: NEWGAMEID,
            hostPlayerId: hostPlayerId,
            playerIds: [],
            playersReady: false,
            playersAnswered: false,
            state: "preGameLobby",
            hasProcessedAnswers: false,
            processedAnswers: [],
            questions: [],
            questionIndex: 0,
            getPlayerList: () => {
              let playerList : Player[] = [];
              for (const playerId of this.Games[NEWGAMEID].playerIds) {
                playerList[playerId] = playerStore.GetPlayer(playerId)
              }
              return playerList
            }
          };
    }

    DeleteGame(gameId: number) {
        delete this.Games[gameId];
    }

    GetGame(gameId: number) {
        return this.Games[gameId];
    }

    GetAnswers(gameId: number) {
        const QUESTIONINDEX = Number(this.Games[gameId].questionIndex);

        let answers : Answer[] = [];
      
        for (const playerId of this.Games[gameId].playerIds) {
          const PLAYERANSWER : Answer ={playerId: playerId, answer: playerStore.GetPlayer(playerId).answers[QUESTIONINDEX].answer, answerType: '' };//aw.players[playerId].answers[QUESTIONINDEX].answer, answerType: '' };
      
          //if answer already exists, skip over it - to avoid duplicates
      
          let answersAry = Object.values(answers);
          if (answersAry.includes(PLAYERANSWER)) {
            continue;
          }
      
          //add to processed answers
          answers.push(PLAYERANSWER);
        }
      
  
        //sort from lowest to highest
       answers = answers.sort((a , b) => {return Number(a.answer) - Number(b.answer)});
      
      
        return answers;
    }

    UpdateGameState(gameId: number, state: string) {
        this.Games[gameId].state = state;
    }

    PlayersAnswered(gameId: number) {
        return this.Games[gameId].playersAnswered;
    }

    UpdateAllPlayersAnsweredStatus(gameId: number) {
        //set playersAnswered to true if all players have answered
        this.Games[gameId].playersAnswered = this.Games[gameId].playerIds.every((playerId) => playerStore.GetPlayer(playerId).answeredStatus);
    }

    UpdateAllPlayersWageredStatus(gameId: number) {

    }

    UpdateAllPlayersReadyStatus(gameId: number)  {
        //set playersReady to true if all players are ready
        this.Games[gameId].playersReady = this.Games[gameId].playerIds.every((playerId) => playerStore.GetPlayer(playerId).readyStatus);
    }

}

export { NewGameStore, GameStore };
