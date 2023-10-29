import { WebsocketEvents } from '../constants'

export type WsClientMessage =
    | EnterLobbyClientMessage
    | ChatClientMessage;

export type WsServerMessage =
    | ConnectServerMessage
    | EnterLobbyServerMessage;

type EnterLobbyClientMessage = {
    type: WebsocketEvents.EnterLobby,
    clientId: string,
    username: string,
};

type ChatClientMessage = {
    type: WebsocketEvents.ChatMessage;
    clientId: string,
    content: string;
};

type ConnectServerMessage = {
    "type": WebsocketEvents.Connect,
    "clientId": string
}

type EnterLobbyServerMessage = {
    "type": WebsocketEvents.EnterLobby,
    "player": {
        id: string,
        username: string,
    },
    "playerCount": number,
}
