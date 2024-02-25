import { playerStore, gameStore } from "../../server";


const disconnect = (socketid : number) => {
    //remove player from players object
    playerStore.DeletePlayer(socketid);
  
    //check if player has hosted any games and remove if needed
    //also check if player has joined any games and remove them from connected players
    for (const [gameId, game] of Object.entries(gameStore)) {
      if (game.hostPlayerId == socketid) {
        gameStore.DeleteGame(Number(gameId));
        break;
      }
  
      if (game.playerIds.indexOf(socketid) !== -1) {
        game.playerIds.splice(game.playerIds.indexOf(socketid), 1);
        break;
      }
    }
  
  };

  export { disconnect } //export disconnect