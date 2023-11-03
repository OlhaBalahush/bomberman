export enum WsMessageTypes {
    //TODO: map all ws events
    Connect = "connect",
    EnterLobby = "enterLobby",
    TwentySecondTimer = "startTwentySecondTimer",
    TenSecondTimer = "startTenSecondTimer",
    StartGame = "startGame",
    ChatMessage = "chatMessage",
}

export class Message{
    Timestamp: Date
    Message:string
    Sender:string
    constructor(msg:string, sender:string){
        this.Message = msg
        this.Sender = sender
        this.Timestamp = new Date()
    }
}