
import { Player } from "./player";
import { broadcastMessage } from "./webSockets";

//TODO:
export class Game {
    //private id: string;
    private players: Player[];

    constructor() {
        this.players = [];
        console.log("new game created");
    }
}