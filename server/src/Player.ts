//TODO
export class Player {
    private _id: string;
    private _username: string;

    constructor(id: string, username: string) {
        this._id = id;
        this._username = username;
        console.log("new player created");
    }

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    getData() {
        return {
            id: this._id,
            username: this._username,
        }
    }
}