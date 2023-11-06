export enum WsMessageTypes {
    //TODO: map all ws events
    Connect = "connect",
    EnterLobby = "enterLobby",
    lobbyJoinSuccess = "lobbyJoinSuccess",
    TwentySecondTimer = "startTwentySecondTimer",
    TenSecondTimer = "startTenSecondTimer",
    StartGame = "startGame",
    ChatMessage = "chatMessage",
    dispatchChatMessage = "dispatchChatMessage"
}

export class ChatMessage{
    timestamp: Date
    message:string
    sender:string
    constructor(msg:string, sender:string){
        this.timestamp = new Date()
        this.message = msg
        this.sender = sender
    }
}