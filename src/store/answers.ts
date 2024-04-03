interface Answer {
  playerId: number;
  answer: string | number | Date;
  answerType: string;
}

interface BoardAnswer {
  answer: string | number | Date;
  odds: number;
  wagered: boolean;
  correctAnswer: boolean;
}

export { Answer, BoardAnswer };
