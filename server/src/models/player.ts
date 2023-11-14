import { Game } from "../Game"
import { wsEvent } from "../models/wsMessage";
import { WsMessageTypes } from "../models/constants";
import { broadcastMessageToGamePlayers } from "../webSockets";

export class gamePlayer {
    private _id: string
    private _username: string
    private _lives: number
    private _powerups: {
        maxBombCount: number
        explosionRange: number
        speed: number
    }
    private _position: { x: number, y: number }
    private _immunityTimer: NodeJS.Timeout | null;
    private _activeBombsPlaced: number;

    constructor(id: string, username: string) {
        this._id = id
        this._username = username
        this._lives = 3
        this._powerups = {
            maxBombCount: 1,
            explosionRange: 2,
            speed: 1
        }
        // TODO adjust to have different position for different players
        this._position = { x: 0, y: 0 }
        this._immunityTimer = null;
        this._activeBombsPlaced = 0;
    }

    get id(): string {
        return this._id
    }

    get username(): string {
        return this._username
    }

    get lives(): number {
        return this._lives
    }

    set lives(value: number) {
        this._lives = value
    }

    get maxBombCount(): number {
        return this._powerups.maxBombCount
    }

    addMaxBombCount(count: number): void {
        this._powerups.maxBombCount += count;
    }

    get explosionRange(): number {
        return this._powerups.explosionRange
    }

    addExplosionRange(range: number): void {
        this._powerups.explosionRange += range;
    }

    get speed(): number {
        return this._powerups.speed
    }

    addSpeed(speed: number): void {
        this._powerups.speed += speed;
        //send new speed to FE:
        const payload = { speed: this._powerups.speed }

    }

    get position(): { x: number; y: number } {
        return this._position
    }

    setPosition(x: number, y: number): void {
        this._position.x = x;
        this._position.y = y;
    }


    get activeBombsPlaced(): number {
        return this._activeBombsPlaced
    }

    canPlaceBomb(): boolean {
        return this.maxBombCount > this.activeBombsPlaced
    }

    increaseActiveBombs() {
        if (this.canPlaceBomb()) {
            this._activeBombsPlaced += 1;
        }
    }

    decreaseActiveBombs() {
        if (this._activeBombsPlaced > 0) {
            this._activeBombsPlaced -= 1;
        }
    }

    startImmunityTimer(game: Game, playerIndex: number): NodeJS.Timeout {
        return setInterval(() => {
            clearInterval(this._immunityTimer!);
            this._immunityTimer = null;
            //sending message of immunity time end
            const payload = {
                playerIndex: playerIndex,
            }
            const messageContent = new wsEvent(WsMessageTypes.ImmunityEnd, payload)
            broadcastMessageToGamePlayers(messageContent, game.players)

        }, 2000);
    }

    loseLife(game: Game, playerIndex: number) {
        if (this.lives > 0 && !this._immunityTimer) {
            this.lives -= 1;

            if (this.lives === 0) {
                game.checkGameOver();
            }

            const payload = {
                playerID: this._id,
                username: this._username,
                playerIndex: playerIndex,
                livesRemaining: this._lives
            }

            const messageContent = new wsEvent(WsMessageTypes.PlayerDamage, payload)
            broadcastMessageToGamePlayers(messageContent, game.players)

            this._immunityTimer = this.startImmunityTimer(game, playerIndex);
        }
    }
}