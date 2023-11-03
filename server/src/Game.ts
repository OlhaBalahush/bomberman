
import { Player } from "./Player";
import { broadcastMessage } from "./webSockets";
import { WsServerMessage } from "./models/wsMessage"
import { WsMessageTypes } from './constants'

//TODO:
export class Game {
    private _id: string;
    private _players: Player[];
    //Chat object here?
    //TODO: game status tracker, either separate object or directly here

    constructor(id: string) {
        this._id = id;
        this._players = [];
        console.log("new game created");
    }

    addPlayer(player: Player): void {
        this._players.push(player);
    }

    removePlayer(playerID: string): void {
        this._players = this._players.filter(player => player.id !== playerID);
    }

    broadcastGameStart(): void {
        const messagePayLoad: WsServerMessage = {
            //TODO: add more data, like map, initial position of players, maybe game id? maybe more info
            "type": WsMessageTypes.StartGame,
        }
        broadcastMessage(messagePayLoad, this._players)
    }

    public get players(): Player[] {
        return this._players;
    }

    public get id(): string {
        return this._id;
    }
}