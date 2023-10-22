import { createDOMElement } from "mini-framework";

const mapFeild = {
    0: "free",
    1: "indestructible",
    2: "destructible",
    3: "player",
    4: "bomb",
    5: "booked" // for development purposes
}

// Initialize the 2D array
const mapWidth = 15;
const mapHeight = 13;
const gameMap = [...Array(mapHeight)].map(() => [...Array(mapWidth)].fill(0))
const edge = (n: number) => n === 0;
const rightEdge = (n: number) => n === mapWidth - 1;
const bottomEdge = (n: number) => n === mapHeight - 1;
const indestructibleBlock = (x: number, y: number) => x % 2 === 0 && y % 2 === 0;

for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
        if (edge(x) || edge(y) || rightEdge(x) || bottomEdge(y) || indestructibleBlock(x, y)) {
            gameMap[y][x] = 1
        }
    }
}

// Define the coordinates of corners
const corners = [
    [1, 1], [1, 2], [2, 1],
    [13, 1], [12, 1], [13, 2],
    [1, 11], [1, 10], [2, 11],
    [13, 11], [12, 11], [13, 10],
];

// Book corners while making map
for (const [x, y] of corners) {
    gameMap[y][x] = 5;
}

// Randomly place 50 indestructible blocks
const indestructibleBlocks = 50;
let placedBlocks = 0;

while (placedBlocks < indestructibleBlocks) {
    const x = Math.floor(Math.random() * mapWidth);
    const y = Math.floor(Math.random() * mapHeight);

    if (gameMap[y][x] !== 1 && gameMap[y][x] !== 5) {
        gameMap[y][x] = 2; // 1 represents indestructible blocks
        placedBlocks++;
    }
}

// Free corners after map is ready
for (const [x, y] of corners) {
    gameMap[y][x] = 0;
}

// Now, gameMap represents your randomized game map with the rules you specified.
const grid = createDOMElement("div", { class: "game-map" }, [])

for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
        let cell
        switch (gameMap[y][x]) {
            case 1:
                cell = createDOMElement("div", { class: "w-[60px] h-[60px] bg-[#D9D9D9] border-2 border-solid border-black" }, [])
                grid.element.appendChild(cell.element)
                break;
            case 2:
                cell = createDOMElement("div", { class: "w-[60px] h-[60px]" }, [
                    createDOMElement("img", {src: "https://cdn.discordapp.com/attachments/1075493710692876330/1165626018829172859/destructible-wall.png?ex=654788d3&is=653513d3&hm=a18178a7ad7cefb56d34d5cb28854fdf275651c1fb3315cb6c13287232eaf89f&", alt: ""}, [])
                ])
                grid.element.appendChild(cell.element)
                break;
            default:
                cell = createDOMElement("div", { class: "w-[60px] h-[60px] bg-lime-800", id: `cell-${x}-${y}` }, [])
                grid.element.appendChild(cell.element)
                break;

        }
    }
}

document.body.appendChild(grid.element)