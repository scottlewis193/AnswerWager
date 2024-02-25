import { playerStore } from "../../server";

const connect = (socketid : number) => {
    //create player
    playerStore.CreatePlayer(socketid);
};

export { connect }