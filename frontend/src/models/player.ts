import { v4 as uuidv4 } from 'uuid';

class Player {
    private _token: string
    private _username: string
    private _lives: number
    private _powerups: {
        maxBombCount: number
        explosionRange: number
        speed: number
    }
    private _position: { x: number, y: number }

    constructor(username: string) {
        this._token = uuidv4()
        this._username = username
        this._lives = 3
        this._powerups = {
            maxBombCount: 1,
            explosionRange: 3,
            speed: 1
        }
        // TODO adjust to have different position for different players
        this._position = { x: 0, y: 0 }
    }

    // made token, not sure if needed
    get token(): string {
        return this._token
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
    }

    get position(): { x: number; y: number } {
        return this._position
    }

    setPosition(x: number, y: number): void {
        this._position.x = x;
        this._position.y = y;
    }
}