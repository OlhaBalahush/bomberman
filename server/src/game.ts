
import { Player } from "./player";
import { broadcastMessage } from "./webSockets";

//TODO:
export class Game {
    //private _id: string;
    private _players: Player[];

    constructor() {
        this._players = [];
        console.log("new game created");
    }

    public get players(): Player[] {
        return this._players;
    }
}