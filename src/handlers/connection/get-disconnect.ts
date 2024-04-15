import { PLAYERSTORE, GAMESTORE } from "../../server";
import { debug } from "../../utils";

const disconnect = (socketid: number) => {
  const PLAYER = PLAYERSTORE.Players[socketid];

  debug(`${PLAYER.playerId} (${PLAYER.playerName}): disconnected from server`);

  //remove player from players object
  PLAYERSTORE.deletePlayer(socketid);

  //check if player has hosted any games and remove if needed
  //also check if player has joined any games and remove them from connected players
  for (const gameId in GAMESTORE.Games) {
    const game = GAMESTORE.Games[gameId];
    if (game.hostPlayerId == socketid) {
      GAMESTORE.deleteGame(Number(gameId));

      debug(`${gameId}: game removed`);

      break;
    }

    if (game.playerIds.indexOf(socketid) !== -1) {
      game.playerIds.splice(game.playerIds.indexOf(socketid), 1);
      break;
    }
  }
};

export { disconnect }; //export disconnect
