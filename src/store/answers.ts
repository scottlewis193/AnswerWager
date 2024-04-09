interface BoardAnswer {
  answer: string | number | Date;
  displayedAnswer: string;
  odds: number;
  wagered: boolean;
  correctAnswer: boolean;
}

export { BoardAnswer };
