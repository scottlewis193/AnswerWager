import { Player } from "./players";

interface Question {
  question: string;
  imageURL: string;
  answerType: string;
  answer: string | number;
  gameId: number;
  playerId: number;
  playerList: Player[]
}

export { Question }