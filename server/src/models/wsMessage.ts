import { WsMessageTypes } from "../../src/models/constants"
import { gameMap } from '../map';

export class wsEvent {
    type: WsMessageTypes
    payload: any

    constructor(type: WsMessageTypes, payload: any) {
        this.type = type
        this.payload = payload
    }
}

type EnterLobbyClientMessage = {
    clientID: string,
    username: string,
}

export type ChatClientMessage = {
    gameID: string,
    content: string,
    sender: string,
};

export type GameClientIinput = {
    gameID: string,
    userID: string,
    key: string,
}

export type PlayerCords = {
    playerIndex: number,
    previousPosition: { x: number, y: number }
    cordinates: { x: number, y: number }
}

type ConnectServerMessage = {
    clientID: string
}

//user info who joined or left lobby needed as well?
type EnterLobbyServerMessage = {
    playerCount: number,
}

type TimerUpdates = {
    seconds: number,
}

type StartGameMessage = {
    gameID: string
}

export type ChatMessage = {
    timestamp: Date
    message: string
    sender: string
}