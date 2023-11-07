
import { broadcastMessage, broadcastMessageToGamePlayers } from "./webSockets";
import { WsMessageTypes } from './models/constants'
import { ChatMessage, wsEvent } from "./models/wsMessage";
import { gamePlayer } from "./models/player";
import { gameMap } from "./map";

//TODO:
export class Game {
    private _id: string;
    private _players: gamePlayer[];
    private _chat: ChatMessage[];
    private _map: gameMap;
    //Chat object here?
    //TODO: game status tracker, either separate object or directly here

    constructor(id: string) {
        this._id = id;
        this._players = [];
        this._chat = [];
        this._map = new gameMap();
        console.log("new game created");
    }

    addPlayer(id: string, username: string): void {
        let player = new gamePlayer(id, username)
        this._players.push(player);
    }

    removePlayer(playerID: string): void {
        this._players = this._players.filter(player => player.id !== playerID);
    }

    addMessage(msg: string, username: string) {
        let newMessage: ChatMessage = { message: msg, sender: username, timestamp: new Date }
        this._chat.push(newMessage)
        const chatMessage: wsEvent = {
            type: WsMessageTypes.ChatMessage,
            payload: newMessage
        }
        broadcastMessageToGamePlayers(chatMessage, this._players)

    }

    broadcastGameStart(): void {
        this._map.placePlayers(this._players)
        const messagePayLoad: wsEvent = {
            //TODO: add more data, like map, initial position of players, maybe game id? maybe more info
            "type": WsMessageTypes.StartGame,
            "payload": {
                gameID: this._id,
                map: this._map.gameMap
            }
        }
        broadcastMessageToGamePlayers(messagePayLoad, this._players)
    }

    public get players(): gamePlayer[] {
        return this._players;
    }

    public get id(): string {
        return this._id;
    }
}