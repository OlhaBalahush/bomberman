import { createDOMElement } from "mini-framework";
import { Coordinates, BombExplosionServerMessage, ReplaceBlockServerMessage, PlayerDamageServerMessage, ImmunityEnd } from "./models/wsMessage";
import bombImage from '../assets/images/bomb.png'
import powerBombImage from '../assets/images/power-bomb.png'
import powerFlameImage from '../assets/images/power-flame.png'
import powerSpeedImage from '../assets/images/power-speed.png'
import flameTop from '../assets/images/explosion-top.png'
import flameBottom from '../assets/images/explosion-bottom.png'
import flameLeft from '../assets/images/explosion-left.png'
import flameRight from '../assets/images/explosion-right.png'
import flameCenter from '../assets/images/explosion-center.png'

export function placeBombOnMap(bombLocation: Coordinates) {
    const mapCellToPlaceBombOn = getMapCellByCoordinates(bombLocation);

    if (!mapCellToPlaceBombOn) {
        console.error(`Unable to find map cell with id: cell-${bombLocation.x}-${bombLocation.y}`)
        return
    }

    const bombElement = createDOMElement("img", { src: bombImage, alt: "bomb", class: "absolute max-h-[45px] object-scale-down z-10 bomb" }, [])
    mapCellToPlaceBombOn.appendChild(bombElement.element)
}

export function placeFlames(flameData: BombExplosionServerMessage) {

    placeFlame(flameData.flameLocations.center, flameCenter)
    removeChildFromCellByClassName(flameData.flameLocations.center, 'bomb')
    placeFlame(flameData.flameLocations.top, flameTop)
    placeFlame(flameData.flameLocations.bottom, flameBottom)
    placeFlame(flameData.flameLocations.left, flameLeft)
    placeFlame(flameData.flameLocations.right, flameRight)
}

export function removeFlames(flameData: BombExplosionServerMessage) {
    removeChildFromCellByClassName(flameData.flameLocations.center, 'flame')
    removeChildFromCellByClassName(flameData.flameLocations.top, 'flame')
    removeChildFromCellByClassName(flameData.flameLocations.bottom, 'flame')
    removeChildFromCellByClassName(flameData.flameLocations.left, 'flame')
    removeChildFromCellByClassName(flameData.flameLocations.right, 'flame')
}

function placeFlame(coordinates: Coordinates, flameImageSrc: string) {
    const cell = getMapCellByCoordinates(coordinates);
    if (cell) {
        const flameElement = createFlameElement(flameImageSrc);
        cell.appendChild(flameElement);
    }
}

function createFlameElement(imageSrc: string): HTMLElement {
    return createDOMElement("img", { src: imageSrc, alt: "flame", class: "absolute max-h-[60px] object-scale-down z-30 flame" }, []).element
}

function getMapCellByCoordinates(coordinates: Coordinates): HTMLElement | null {
    if (!coordinates) {
        return null;
    }
    return document.getElementById(`cell-${coordinates.x}-${coordinates.y}`);
}

function removeChildFromCellByClassName(cellCoordinates: Coordinates, className: string): void {
    const cell = getMapCellByCoordinates(cellCoordinates);
    if (cell) {
        const childToRemove = Array.from(cell.children).find(child =>
            child.classList.contains(className)
        );

        if (childToRemove) {
            cell.removeChild(childToRemove);
        }
    }
}

function addPowerupToCellByCoordinates(coordinates: Coordinates, powerup: number) {
    const powerUpSpawnCell = getMapCellByCoordinates(coordinates)

    interface PowerupDictionary {
        [key: number]: string;
    }

    const dictOfPowerups: PowerupDictionary = {
        9: powerSpeedImage,
        10: powerFlameImage,
        11: powerBombImage,
    }
    const powerImg = createDOMElement("img", { src: dictOfPowerups[powerup], alt: "powerup IMG" }, [])
    powerUpSpawnCell?.appendChild(powerImg.element);
}

function removeAllChildrenFromElement(element: HTMLElement | null) {
    if (!element) {
        console.log("no element found, error")
        return
    }
    element.innerHTML = ""
}

export function replaceCellOnMap(newCellData: ReplaceBlockServerMessage) {
    removeChildFromCellByClassName(newCellData.coordinates, "destructible") // this line removes the block from playing field, meaning It should run no matter the value
    switch (newCellData.newCellID) {
        case 0:
            removeAllChildrenFromElement(getMapCellByCoordinates(newCellData.coordinates))
            break;
        case 9:
        //speed
        case 10:
        //bombExplosionrange
        case 11:
            //bombCount
            addPowerupToCellByCoordinates(newCellData.coordinates, newCellData.newCellID)
            break;
        default:
            break;
    }
}


export function handlePlayerLifeLost(damagedPlayerData: PlayerDamageServerMessage) {
    const damagedPlayerElement = document.getElementById(`character-${damagedPlayerData.playerIndex}`)

    if (damagedPlayerElement) {
        damagedPlayerElement.classList.add("damaged-player")
    }

    if (sessionStorage.getItem("clientID") === damagedPlayerData.playerID) {
        const livesLeftContainer = document.querySelector("#lives")
        if (livesLeftContainer) livesLeftContainer.textContent = "lives: " + damagedPlayerData.livesRemaining
    }
}

export function disableImmunityAnimation(immunityPlayer: ImmunityEnd) {
    const immunePlayerElement = document.getElementById(`character-${immunityPlayer.playerIndex}`)
    if (immunePlayerElement) {
        immunePlayerElement.classList.remove("damaged-player")
    }
}
