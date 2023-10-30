import { Player } from "./Player";
import { broadcastMessage } from "./webSockets";
import { WsServerMessage } from "./models/wsMessage"
import { WsMessageTypes } from './constants'
import { LobbyTimer } from "./LobbyTimer";

export class Lobby {
    private _id: string;
    private _players: Player[];
    private _timer: LobbyTimer;

    constructor(id: string) {
        this._id = id;
        this._players = [];
        this._timer = new LobbyTimer();
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

    removePlayer(playerId: string): void {
        this._players = this._players.filter(player => player.id !== playerId);
    }

    hasPlayer(playerId: string): boolean {
        return this._players.some(player => player.id === playerId);
    }

    broadcastPlayerCountChange(): void {
        const messagePayLoad: WsServerMessage = {
            "type": WsMessageTypes.EnterLobby,
            "playerCount": this.getCountOfPlayers(),
        }
        broadcastMessage(messagePayLoad, this._players)
    }

    broadcastTimerChange(remainingTime: number, timerType: number): void {
        const messagePayLoad: WsServerMessage = {
            "type": timerType === 20 ? WsMessageTypes.TwentySecondTimer : WsMessageTypes.TenSecondTimer,
            "seconds": remainingTime,
        }
        broadcastMessage(messagePayLoad, this._players)
    }

    get id(): string {
        return this._id;
    }

    get players(): Player[] {
        return this._players;
    }

    public get timer(): LobbyTimer {
        return this._timer;
    }
}