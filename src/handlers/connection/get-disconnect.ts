import { playerStore, gameStore } from "../../server";
import { debug } from "../../utils"; 
import { BoardAnswer } from "../../store/answers";


const disconnect = (socketid : number) => {
      const PLAYER = playerStore.Players[socketid]

  debug(`${PLAYER.playerId} (${PLAYER.playerName}): disconnected from server`);

    //remove player from players object
    playerStore.DeletePlayer(socketid);
  
    //check if player has hosted any games and remove if needed
    //also check if player has joined any games and remove them from connected players
    for (const gameId in gameStore.Games) {
      const game = gameStore.Games[gameId];
      if (game.hostPlayerId == socketid) {
        gameStore.DeleteGame(Number(gameId));

        debug(`${gameId}: game removed`);

        break;
      }

  
      if (game.playerIds.indexOf(socketid) !== -1) {
        game.playerIds.splice(game.playerIds.indexOf(socketid), 1);
        break;
      }



    }
  
  };

  export { disconnect } //export disconnect