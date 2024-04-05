import { GAMESTORE, PLAYERSTORE } from "../server.js";
function newViewData(playerId, gameId = -1) {
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
    constructor() {
        this.player = {};
        this.players = [];
        this.game = {};
        this.questions = [];
        this.answers = [];
    }
}
export { newViewData };
//# sourceMappingURL=viewdata.js.map