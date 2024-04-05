import { GAMESTORE, PLAYERSTORE } from "../server";
import { BoardAnswer } from "./answers";
import { Game } from "./games";
import { Player } from "./players";
import { Question } from "./questions";

function newViewData(playerId: number, gameId: number = -1) {
  var vd = new viewData();
  vd.player = PLAYERSTORE.getPlayer(playerId);
  if (gameId != -1) {
    vd.game = GAMESTORE.getGame(gameId);
    vd.players = vd.game.getPlayers();
    vd.questions = vd.game.questions;
    vd.answers = vd.game.processedAnswers;
  }
  return vd;
}

class viewData {
  constructor() {}
  player: Player = {} as Player;
  players: Player[] = [];
  game: Game = {} as Game;
  questions: Question[] = [];
  answers: BoardAnswer[] = [];
}

export { newViewData };
