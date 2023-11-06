export class Message{
    timestamp: Date
    message:string
    sender:string
    constructor(msg:string, sender:string){
        this.message = msg
        this.sender = sender
        this.timestamp = new Date()
    }
}