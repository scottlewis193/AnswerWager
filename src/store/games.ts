
import { generateId } from "../utils";
import { playerStore } from "../server";
import {  IGameStore,IPlayerStore } from "./store";
import { BoardAnswer, Answer } from "./answers";
import { Question } from "./questions";
import { getMiddleIndex } from "../utils";
import { Player } from "./players";

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
        this.Games[NEWGAMEID] = new Game(NEWGAMEID, hostPlayerId);
        return NEWGAMEID
    }

    DeleteGame(gameId: number) {
        delete this.Games[gameId];
    }

    GetGame(gameId: number) {
        return this.Games[gameId];
    }

  

}

class Game {
    gameId: number
    hostPlayerId: number
    playerIds: number[]
    playersReady: boolean
    playersAnswered: boolean
    playersWagered: boolean
    state: string
    hasProcessedAnswers: boolean
    processedAnswers: BoardAnswer[]
    questions: Question[]
    questionIndex: number

    constructor(gameId: number, hostPlayerId: number) {
     this.gameId = gameId,
     this.hostPlayerId = hostPlayerId,
     this.playerIds = [hostPlayerId],
     this.playersReady = false,
     this.playersAnswered = false,
     this.playersWagered = false,
     this.state = "preGameLobby",
     this.hasProcessedAnswers = false,
     this.processedAnswers = [],
     this.questions = [],
     this.questionIndex = 0
    }

    GetPlayerList() {
        let playerList : Player[] = [];
        for (const playerId of this.playerIds) {
          playerList[playerId] = playerStore.GetPlayer(playerId)
        }
        return playerList
    }

    UpdateGameState(state: string) {
        this.state = state;
    }

    PlayersAnswered() {
        return this.playersAnswered;
    }

    UpdateAnsweredStatus() {
        //set playersAnswered to true if all players have answered
        this.playersAnswered = this.playerIds.every((playerId) => playerStore.GetPlayer(playerId).answeredStatus);
    }

    UpdateReadyStatus()  {
        //set playersReady to true if all players are ready
        this.playersReady = this.playerIds.every((playerId) => playerStore.GetPlayer(playerId).readyStatus);
    }

    UpdateWageredStatus() {
        //set playersReady to true if all players are ready
        this.playersWagered = this.playerIds.every((playerId) => playerStore.GetPlayer(playerId).wageredStatus);
    }

    ProcessAnswers() {

        const answers = this.GetAnswers()

        let boardAnswers: BoardAnswer[] = [];

        for (let index : number = 0; index < Object.keys(answers).length; index++) {
            boardAnswers[index] = {
            answer: answers[index].answer,
            odds: '0',
            }
    
        }

        const MIDDLEANSWERINDEX = getMiddleIndex(boardAnswers)
        for (let index = 0; index < Object.keys(boardAnswers).length; index++) {
            if (index < MIDDLEANSWERINDEX) {
                const oddsnum = Math.abs(index - 2 - MIDDLEANSWERINDEX);
                boardAnswers[index].odds = oddsnum + "/1";
            }
            if (index == MIDDLEANSWERINDEX) {
                boardAnswers[index].odds = "2/1";
            }
            if (index > MIDDLEANSWERINDEX) {
                const oddsnum = index + 2 - MIDDLEANSWERINDEX;
                boardAnswers[index].odds = oddsnum + "/1";
            }
        }
        this.hasProcessedAnswers = true;
        this.processedAnswers = boardAnswers
        
    }

    GetAnswers() {
        const QUESTIONINDEX = Number(this.questionIndex);

        let answers : Answer[] = [];
      
        for (const playerId of this.playerIds) {
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

     isHost(playerId : number) {
        return playerId == this.hostPlayerId;
     };
}

export { NewGameStore, GameStore, Game };
