
interface Answer {
  playerId: number;
  answer: string | number ;
  answerType: string;
}

interface BoardAnswer {
  answer: string | number;
  odds: string;
  wagered: boolean;
  correctAnswer: boolean;
}

export {
  Answer,
  BoardAnswer,
}

