import { gamePlayer } from "./models/player";
import { Game } from "./Game";
import { Coordinates } from "./models/helpers"
import { broadcastMessageToGamePlayers } from "./webSockets";
import { wsEvent } from "./models/wsMessage";
import { WsMessageTypes } from "./models/constants";

type BombFlames = {
    center: Coordinates,
    top: Coordinates[],
    bottom: Coordinates[],
    left: Coordinates[],
    right: Coordinates[]
}

export class Bomb {
    private _game: Game;
    private _detonatonTimer: NodeJS.Timeout | null;
    private _location: Coordinates;
    private _range: number;

    constructor(bombOwner: gamePlayer, game: Game) {
        this._game = game;
        this._range = bombOwner.explosionRange;
        this._location = { ...bombOwner.position };
        this._detonatonTimer = this.startDetonationTimer();
    }

    startDetonationTimer(): NodeJS.Timeout {
        this.broadcastBombPlaced();
        return setInterval(() => {
            clearInterval(this._detonatonTimer!);
            this._detonatonTimer = null;
            this.broadcastBombFlameLocations(this.getAllFlameLocations());
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

    getAllFlameLocations(): BombFlames {
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
            if (this.canFlameCoverField(fieldID)) {
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

    canFlameCoverField(fieldID: number): boolean {
        switch (fieldID) {
            case 1:
                //indestructible - will not let flame go there, no other actions
                return false;
            case 3:
            case 4:
            case 5:
            case 6:
                //take one life from player
                this._game.players[fieldID - 3].loseLife();
                //broadcast life lost in player object
                //handle player dead probably in game object, or player object, will see
                return true;
            case 7:
                //detonate bomb that got on the way or maybe actually better to do nothing, let it survive flame and detonate when is it's time
                return true;
            default:
                // free 0, booked 8, destructible 2 - will allow flame to go there, no other actions
                return true;
        }
    }

    broadcastBombPlaced(): void {
        let payload = {
            bombLocation: this._location
        }
        let messageContent = new wsEvent(WsMessageTypes.BombPlaced, payload)
        broadcastMessageToGamePlayers(messageContent, this._game.players);
    }

    broadcastBombFlameLocations(flameLocations: BombFlames): void {
        let payload = {
            flameLocations: flameLocations,
            range: this._range
        }
        let messageContent = new wsEvent(WsMessageTypes.BombExplosion, payload)
        broadcastMessageToGamePlayers(messageContent, this._game.players);
    }

}


//check if any players in the flames, also if player moves to flames while flame is active - this should be covered in player movement

//remove blocks -maybe need to trigger from frontend, if we will have gradual flame animation (or add some small timer based on animation duration time in fe) or send each flame level separately to fe

//powerups to keep in mind - perhaps remove block and powerup addition will be done in FE, so not covered here

//keep track of amount of bombs player has, if player can add another bomb or not - pribably new property for player class needed nr of bombs
//this check should be done when message comes in, if player max boms placed, then will not create new bomb object