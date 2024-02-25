import { Player } from "./store";

interface Question {
  question: string;
  imageURL: string;
  answerType: string;
  answer: string | number;
  gameId: number;
  playerId: number;
  playerList: Player[]
}