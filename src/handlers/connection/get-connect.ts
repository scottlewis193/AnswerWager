import { PLAYERSTORE } from "../../server";

const connect = (socketid: number) => {
  //create player
  PLAYERSTORE.createPlayer(socketid);
};

export { connect };
