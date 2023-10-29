import { Player } from "./player";
import { broadcastMessage } from "./webSockets";

//TODO:
export class Lobby {
    private _id: string;
    private _players: Player[];

    constructor(id: string) {
        this._id = id;
        this._players = [];
        console.log("new lobby created");
    }

    addPlayer(player: Player): void {
        if (this.getCountOfPlayers() < 4) {
            this._players.push(player);
        } else {
            console.log("Lobby with id " + this._id + " has already " + this.getCountOfPlayers + " players.")
        }
    }

    getCountOfPlayers = (): number => this._players.length;

    isFull = (): boolean => this.getCountOfPlayers() === 4;

    get id(): string {
        return this._id;
    }

    get players(): Player[] {
        return this._players;
    }
}