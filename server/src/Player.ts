import WebSocket from "ws";

export class wsPlayer {
    private _id: string;
    private _username?: string;
    conn: WebSocket;

    constructor(id: string, conn: WebSocket) {
        this._id = id;
        this.conn = conn;
    }

    get id(): string {
        return this._id;
    }

    get username(): string | undefined {
        return this._username;
    }

    getData() {
        return {
            id: this._id,
            username: this._username,
            conn: this.conn,
        }
    }
}