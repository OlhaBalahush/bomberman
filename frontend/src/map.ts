import { createDOMElement } from "mini-framework";

const peers: string[] = [
    'https://media.discordapp.net/attachments/1160893534635839524/1165628274160959538/player1.png?ex=6559ffec&is=65478aec&hm=78e299cbfc1ff2a9c43820fe2d61e1a75a32e023a433d6799a914e1ab299cea5&=',
    'https://media.discordapp.net/attachments/1160893534635839524/1165628273892536370/player2.png?ex=6559ffec&is=65478aec&hm=b6bd7f74754933cc178072c4d287ccf4a224920fc221fd306a7438f5d5c758bc&=',
    'https://media.discordapp.net/attachments/1160893534635839524/1165628273636687942/player3.png?ex=6559ffec&is=65478aec&hm=fdd0ad119a32e69c5dcbc3fd03c33b55f03728ea0970a6abf2d779a74d4786e9&=',
    'https://media.discordapp.net/attachments/1160893534635839524/1165628273330487386/player4.png?ex=6559ffec&is=65478aec&hm=03acca8a640d3e73bfb95ca91b7f06626736cec6b524bc3dcbd7cc56bce65f9b&='
]

export function renderMap(flatString: string) {
    const values = flatString.split(",");

    // Assuming your map dimensions are 15x13
    const mapWidth = 15;
    const mapHeight = 13;

    // Create a 2D array to store the values
    const gameMap: number[][] = [];
    for (let y = 0; y < mapHeight; y++) {
        const row: number[] = [];
        for (let x = 0; x < mapWidth; x++) {
            // Pop a value from the values array and push it to the row
            row.push(parseInt(values.shift() || "0", 10));
        }
        gameMap.push(row);
    }

    const grid = createDOMElement("div", { class: "game-map flex flex-wrap shrink-0 bg-lime-800" }, [])

    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            let cell
            switch (gameMap[y][x]) {
                case 1:
                    cell = createDOMElement("div", { class: "w-[60px] h-[60px] bg-[#D9D9D9] border-2 border-solid border-black", id: `cell-${x}-${y}` }, [])
                    grid.element.appendChild(cell.element)
                    break;
                case 2:
                    cell = createDOMElement("div", { class: "w-[60px] h-[60px]", id: `cell-${x}-${y}` }, [
                        createDOMElement("img", { src: "https://cdn.discordapp.com/attachments/1075493710692876330/1165626018829172859/destructible-wall.png?ex=654788d3&is=653513d3&hm=a18178a7ad7cefb56d34d5cb28854fdf275651c1fb3315cb6c13287232eaf89f&", alt: "" }, [])
                    ])
                    grid.element.appendChild(cell.element)
                    break;
                case 3:
                    cell = createDOMElement("div", { class: "w-[60px] h-[60px] flex items-center justify-center", id: `cell-${x}-${y}` }, [
                        createDOMElement("img", { src: peers[0], alt: "", class: "max-h-[60px] object-scale-down" }, [])
                    ])
                    grid.element.appendChild(cell.element)
                    break;
                case 4:
                    cell = createDOMElement("div", { class: "w-[60px] h-[60px] flex items-center justify-center", id: `cell-${x}-${y}` }, [
                        createDOMElement("img", { src: peers[1], alt: "", class: "max-h-[60px] object-scale-down" }, [])
                    ])
                    grid.element.appendChild(cell.element)
                    break;
                case 5:
                    cell = createDOMElement("div", { class: "w-[60px] h-[60px] flex items-center justify-center", id: `cell-${x}-${y}` }, [
                        createDOMElement("img", { src: peers[2], alt: "", class: "max-h-[60px] object-scale-down" }, [])
                    ])
                    grid.element.appendChild(cell.element)
                    break;
                case 6:
                    cell = createDOMElement("div", { class: "w-[60px] h-[60px] flex items-center justify-center", id: `cell-${x}-${y}` }, [
                        createDOMElement("img", { src: peers[3], alt: "", class: "max-h-[60px] object-scale-down" }, [])
                    ])
                    grid.element.appendChild(cell.element)
                    break;
                default:
                    cell = createDOMElement("div", { class: "w-[60px] h-[60px]", id: `cell-${x}-${y}` }, [])
                    grid.element.appendChild(cell.element)
                    break;

            }
        }
    }

    return grid;
}