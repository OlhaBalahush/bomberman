
import { broadcastMessage, broadcastMessageToGamePlayers, clientsHashMap } from "./webSockets";
import { WsMessageTypes } from './models/constants'
import { ChatMessage, wsEvent } from "./models/wsMessage";
import { gamePlayer } from "./models/player";
import { gameMap } from "./map";
import { v4 as uuidv4 } from "uuid";

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
        this.checkGameOver()
    }

    checkGameOver():void{
        const alive = this._players = this._players.filter(player => {
            if (player.lives < 1) this.gameOver(player.id, "game over!")
            return player.lives > 0
        });

        if (alive.length === 1) {
            alive.forEach(player => this.gameOver(player.id, "you win!"))
        }
    }

    gameOver(playerID:string, message: string):void{
        const event: wsEvent = {
            type: WsMessageTypes.GameOver,
            payload: {
                message: message
            }
        }
        const wsClient = clientsHashMap.get(playerID)
        if (wsClient) broadcastMessage(event, [wsClient])
    }

    public get map(): gameMap {
        return this._map
    }

    public get players(): gamePlayer[] {
        return this._players;
    }

    public get id(): string {
        return this._id;
    }
}