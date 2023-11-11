import { WsMessageTypes } from './constants'

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

type ConnectServerMessage = {
    clientID: string
}

//user info who joined or left lobby needed as well?
export type EnterLobbyServerMessage = {
    playerCount: number,
}

export type TimerUpdates = {
    seconds: number,
}

type StartGameMessage = {
    gameID: string,
    map: number[][]
}

export type ChatMessage = {
    timestamp: Date
    message: string
    sender: string
}

export type BombPlacedServerMessage = {
    bombLocation: Coordinates
}

export type BombExplosionServerMessage = {
    flameLocations: BombFlames,
    range: number
}

export type BombFlames = {
    center: Coordinates
    top: Coordinates[],
    bottom: Coordinates[],
    left: Coordinates[],
    right: Coordinates[]
}

export type Coordinates = {
    x: number,
    y: number,
}