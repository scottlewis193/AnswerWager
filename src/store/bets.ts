interface Bet {
  playerId: number;
  answer: string | number | Date;
  amount: number;
  odds: number;
}

export { Bet };
