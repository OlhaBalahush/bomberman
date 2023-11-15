import { gamePlayer } from "./models/player";
import { Game } from "./Game";
import { Coordinates } from "./models/helpers"
import { broadcastMessageToGamePlayers } from "./webSockets";
import { wsEvent } from "./models/wsMessage";
import { WsMessageTypes } from "./models/constants";
import { wsPlayer } from "./Player";

type FlameLocations = {
    center: Coordinates,
    top: Coordinates[],
    bottom: Coordinates[],
    left: Coordinates[],
    right: Coordinates[]
}

const FLAME_DELAY = 60;

function getRandomPowerupInt(): number {
    const values = [9, 10, 11];
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
}

export class Bomb {
    private _game: Game;
    private _detonatonTimer: NodeJS.Timeout | null;
    private _location: Coordinates;
    private _range: number;
    private _bombOwner: gamePlayer;

    constructor(bombOwner: gamePlayer, game: Game) {
        this._game = game;
        this._bombOwner = bombOwner;
        this._range = bombOwner.explosionRange;
        this._location = { ...bombOwner.position };
        this._detonatonTimer = this.startDetonationTimer();
    }

    startDetonationTimer(): NodeJS.Timeout {
        this.broadcastBombPlaced();
        const allFlames: FlameLocations = this.getAllFlameLocations()

        return setInterval(() => {
            clearInterval(this._detonatonTimer!);
            this._detonatonTimer = null;
            this.broadcastBombFlamesEvent(allFlames);
            this._bombOwner.decreaseActiveBombs();
        }, 3000);
    }

    nextFlameLocation(direction: string, previousLocation: Coordinates): Coordinates {
        switch (direction) {
            case "top":
                return {
                    x: previousLocation.x,
                    y: previousLocation.y - 1
                }
            case "bottom":
                return {
                    x: previousLocation.x,
                    y: previousLocation.y + 1
                }
            case "left": {
                return {
                    x: previousLocation.x - 1,
                    y: previousLocation.y
                }
            }
            default:
                return {
                    x: previousLocation.x + 1,
                    y: previousLocation.y
                }
        }
    }

    getAllFlameLocations(): FlameLocations {
        return {
            center: this._location,
            top: this.mapFlameLocationsPerDirection("top"),
            bottom: this.mapFlameLocationsPerDirection("bottom"),
            left: this.mapFlameLocationsPerDirection("left"),
            right: this.mapFlameLocationsPerDirection("right")
        };
    }

    mapFlameLocationsPerDirection(direction: string): Coordinates[] {
        let locations: Coordinates[] = [];
        let previouslocation = this._location;

        for (let level = 0; level < this._range; level++) {
            let nextLocation = this.nextFlameLocation(direction, previouslocation);
            let fieldID = this._game.map.getFieldID(nextLocation.x, nextLocation.y);
            if (fieldID !== 1) {
                locations.push(nextLocation);
                if (fieldID === 2) {
                    //so flame would not go further from this destructible wall
                    break;
                }
            } else {
                break;
            }
            previouslocation = nextLocation;
        }
        return locations;
    }

    broadcastBombPlaced(): void {
        //adding bomb on map so user will not be able to walk through bomb
        this._game.map.setFieldID(this._location.x, this._location.y, 7)

        let payload = {
            bombLocation: this._location
        }
        let messageContent = new wsEvent(WsMessageTypes.BombPlaced, payload)
        broadcastMessageToGamePlayers(messageContent, this._game.players);
    }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async addFlamesWithDelay(locations: FlameLocations) {
        // Add center flame
        this._game.map.addActiveFlames([locations.center]);
        await this.broadcastAndDelay(WsMessageTypes.PlaceFlames, { flameLocations: { center: locations.center } });

        //removing bomb from map so user can walk there again
        this._game.map.setFieldID(this._location.x, this._location.y, 0)
        this.checkHitPlayersAndReduceLife(locations.center)

        // All the rest of the flames per range
        for (let i = 0; i < this._range; i++) {
            const payload = {
                flameLocations: {
                    top: locations.top[i],
                    bottom: locations.bottom[i],
                    left: locations.left[i],
                    right: locations.right[i]
                }
            };

            //keeping track of where are flames active on map, to be able to detect player walking into flames
            const flamesToAdd = [
                locations.top[i],
                locations.bottom[i],
                locations.left[i],
                locations.right[i]
            ].filter(location => location !== undefined && location !== null);

            this._game.map.addActiveFlames(flamesToAdd);
            flamesToAdd.forEach(location => this.checkHitPlayersAndReduceLife(location));

            await this.broadcastAndDelay(WsMessageTypes.PlaceFlames, payload);
        }
    }

    async removeFlamesWithDelay(locations: FlameLocations) {
        for (let i = this._range - 1; i >= 0; i--) {
            const payload = {
                flameLocations: {
                    top: locations.top[i],
                    bottom: locations.bottom[i],
                    left: locations.left[i],
                    right: locations.right[i]
                }
            };

            const flamesToRemove = [
                locations.top[i],
                locations.bottom[i],
                locations.left[i],
                locations.right[i]
            ]
            flamesToRemove.forEach(location => {
                let isFlameRemoved: boolean = this._game.map.removeActiveFlames(location)
                if (isFlameRemoved) {
                    this.checkAndRemoveBlock(location);
                }
            });

            await this.broadcastAndDelay(WsMessageTypes.RemoveFlames, payload);
        }

        // Remove center flame
        await this.broadcastAndDelay(WsMessageTypes.RemoveFlames, { flameLocations: { center: locations.center } });
        this._game.map.removeActiveFlames(locations.center);
    }

    async broadcastAndDelay(messageType: WsMessageTypes, payload: any) {
        const messageContent = new wsEvent(messageType, payload);
        broadcastMessageToGamePlayers(messageContent, this._game.players);
        await this.delay(FLAME_DELAY);
    }

    async broadcastBombFlamesEvent(flameLocations: FlameLocations) {
        await this.addFlamesWithDelay(flameLocations);
        await this.delay(FLAME_DELAY * 4);
        await this.removeFlamesWithDelay(flameLocations);
    }



    checkAndRemoveBlock(location: Coordinates) {
        // Remove removable block if it was under the flame
        const fieldID = this._game.map.getFieldID(location.x, location.y);
        if (fieldID === 2) {
            //replace here with some randvalue generator that would sometimes add powerup instead of just free cell
            let newCellValue = 0;
            if (Math.random() < 0.5) {
                //50 precent change of a powerup
                newCellValue = getRandomPowerupInt()
            }
            this._game.map.setFieldID(location.x, location.y, newCellValue)

            const payload = {
                coordinates: location,
                newCellID: newCellValue,
            }
            const messageContent = new wsEvent(WsMessageTypes.ReplaceBlock, payload)
            broadcastMessageToGamePlayers(messageContent, this._game.players)
        }
    }

    checkHitPlayersAndReduceLife(location: Coordinates) {
        const playersInFlames = this._game.players.filter(player => player.position.x === location.x && player.position.y === location.y)

        playersInFlames.forEach(player => {
            const playerIndex = player.playerNumber
            player.loseLife(this._game, playerIndex);
        })
    }

}
