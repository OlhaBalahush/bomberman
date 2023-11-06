
import { Player } from "./Player";
import { broadcastMessage } from "./webSockets";
import { ChatMessage, WsMessageTypes } from './constants'
import { wsEvent } from "./models/wsMessage";

//TODO:
export class Game {
    private _id: string;
    private _players: Player[];
    private _chat: ChatMessage[];
    //Chat object here?
    //TODO: game status tracker, either separate object or directly here

    constructor(id: string) {
        this._id = id;
        this._players = [];
        this._chat = []
        console.log("new game created");
    }

    addPlayer(player: Player): void {
        this._players.push(player);
    }

    removePlayer(playerID: string): void {
        this._players = this._players.filter(player => player.id !== playerID);
    }

    addMessage(msg:string, username:string){
        let newMessage = new ChatMessage(msg, username)
        this._chat.push(newMessage)
        const chatMessage: wsEvent = {
            type: WsMessageTypes.dispatchChatMessage,
            payload: newMessage 
        }
        broadcastMessage(chatMessage, this._players)

    }

    broadcastGameStart(): void {
        const messagePayLoad: wsEvent = {
            //TODO: add more data, like map, initial position of players, maybe game id? maybe more info
            "type": WsMessageTypes.StartGame,
            "payload": {
                gameID: this._id
            }
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