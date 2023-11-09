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
            explosionRange: 3,
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

    startImmunityTimer(): NodeJS.Timeout {
        return setInterval(() => {
            clearInterval(this._immunityTimer!);
            this._immunityTimer = null;
            //send message of immunity time end, if will use some damage animation
        }, 2000);
    }

    loseLife(): void {
        if (this.lives < 0 && !this._immunityTimer) {
            this.lives -= 1;
            //send message of life lost
            this.startImmunityTimer();
        }
    }
}