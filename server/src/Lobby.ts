import { broadcastMessage } from "./webSockets";
import { WsMessageTypes } from './models/constants'
import { LobbyTimer } from "./LobbyTimer";
import { wsEvent } from "./models/wsMessage";
import { gamePlayer } from "./models/player";

export class Lobby {
    private _id: string;
    private _players: gamePlayer[];
    private _timer: LobbyTimer;

    constructor(id: string) {
        this._id = id;
        this._players = [];
        this._timer = new LobbyTimer();
        console.log("new lobby created");
    }

    addPlayer(player: gamePlayer): void {
        if (this.getCountOfPlayers() < 4) {
            this._players.push(player);
        } else {
            console.log("Lobby with id " + this._id + " has already " + this.getCountOfPlayers + " players.")
        }
    }

    getCountOfPlayers = (): number => this._players.length;

    isFull = (): boolean => this.getCountOfPlayers() === 4;

    removePlayer(playerID: string): void {
        this._players = this._players.filter(player => player.id !== playerID);
    }

    hasPlayer(playerID: string): boolean {
        return this._players.some(player => player.id === playerID);
    }

    broadcastPlayerCountChange(): void {
        const messagePayLoad: wsEvent = {
            "type": WsMessageTypes.EnterLobby,
            "payload":{
                "playerCount": this.getCountOfPlayers(),
            }
        }
        broadcastMessage(messagePayLoad, this._players)
    }

    broadcastTimerChange(remainingTime: number, timerType: number): void {
        const messagePayLoad: wsEvent = {
            "type": timerType === 20 ? WsMessageTypes.TwentySecondTimer : WsMessageTypes.TenSecondTimer,
            "payload":{
                "seconds": remainingTime,
            }
        }
        broadcastMessage(messagePayLoad, this.players)
    }

    get id(): string {
        return this._id;
    }

    get players(): gamePlayer[] {
        return this._players;
    }

    public get timer(): LobbyTimer {
        return this._timer;
    }
}