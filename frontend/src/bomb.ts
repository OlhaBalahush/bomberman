import { createDOMElement } from "mini-framework";
import { Coordinates, BombExplosionServerMessage } from "./models/wsMessage";
import bombImage from '../assets/images/bomb.png'
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


export function explodeBomb(flameData: BombExplosionServerMessage) {

    const centerFlameElement = createDOMElement("img", { src: flameCenter, alt: "flame", class: "absolute max-h-[60px] object-scale-down z-50 flame" }, [])

    const centerCell = getMapCellByCoordinates(flameData.flameLocations.center);
    centerCell!.appendChild(centerFlameElement.element)

    for (let i = 0; i < flameData.range; i++) {
        const topCell = getMapCellByCoordinates(flameData.flameLocations.top[i])
        if (topCell) {
            const topFlameElement = createDOMElement("img", { src: flameTop, alt: "flame", class: "absolute max-h-[60px] object-scale-down z-50 flame" }, [])
            topCell.appendChild(topFlameElement.element)
        }

        const bottomCell = getMapCellByCoordinates(flameData.flameLocations.bottom[i])
        if (bottomCell) {
            const bottomFlameElement = createDOMElement("img", { src: flameBottom, alt: "flame", class: "absolute max-h-[60px] object-scale-down z-50 flame" }, [])
            bottomCell.appendChild(bottomFlameElement.element)
        }

        const leftCell = getMapCellByCoordinates(flameData.flameLocations.left[i])
        if (leftCell) {
            const leftFlameElement = createDOMElement("img", { src: flameLeft, alt: "flame", class: "absolute max-h-[60px] object-scale-down z-50 flame" }, [])
            leftCell.appendChild(leftFlameElement.element)
        }

        const rightCell = getMapCellByCoordinates(flameData.flameLocations.right[i])
        if (rightCell) {
            const rightFlameElement = createDOMElement("img", { src: flameRight, alt: "flame", class: "absolute max-h-[60px] object-scale-down z-50 flame" }, [])
            rightCell.appendChild(rightFlameElement.element)
        }
    }
}

function getMapCellByCoordinates(coordinates: Coordinates): HTMLElement | null {
    if (!coordinates) {
        return null;
    }

    return document.getElementById(`cell-${coordinates.x}-${coordinates.y}`);
}
