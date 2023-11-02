import { WsMessageTypes } from '../constants'

export type WsClientMessage =
    | EnterLobbyClientMessage
    | ChatClientMessage;

export type WsServerMessage =
    | ConnectServerMessage
    | TimerUpdates
    | EnterLobbyServerMessage;

type EnterLobbyClientMessage = {
    type: WsMessageTypes.EnterLobby,
    clientID: string,
    username: string,
};

type ChatClientMessage = {
    type: WsMessageTypes.ChatMessage;
    clientID: string,
    content: string;
};

type ConnectServerMessage = {
    type: WsMessageTypes.Connect,
    clientID: string
}

//user info who joined or left lobby needed as well?
type EnterLobbyServerMessage = {
    type: WsMessageTypes.EnterLobby,
    playerCount: number,
}

type TimerUpdates = {
    type: WsMessageTypes.TwentySecondTimer | WsMessageTypes.TenSecondTimer,
    seconds: number,
}
