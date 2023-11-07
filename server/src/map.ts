// const mapFeild = {
//     0: "free",
//     1: "indestructible",
//     2: "destructible",
//     3: "player1",
//     4: "player2",
//     5: "player3",
//     6: "player4",
//     7: "bomb",
//     8: "booked" // for development purposes
// }

import { gamePlayer } from "./models/player";


export class gameMap {
    mapWidth: number = 15;
    mapHeight: number = 13;
    gameMap: number[][] = [...Array(this.mapHeight)].map(() => [...Array(this.mapWidth)].fill(0));
    corners: [number, number][] = [
        [1, 1], [1, 2], [2, 1],
        [13, 1], [12, 1], [13, 2],
        [1, 11], [1, 10], [2, 11],
        [13, 11], [12, 11], [13, 10],
    ];

    constructor() {
        this.initMap();
        this.bookCorners();
        this.placeIndestructibleBlocks(50);
        this.freeCorners();
    }

    private initMap() {
        const edge = (n: number) => n === 0;
        const rightEdge = (n: number) => n === this.mapWidth - 1;
        const bottomEdge = (n: number) => n === this.mapHeight - 1;
        const indestructibleBlock = (x: number, y: number) => x % 2 === 0 && y % 2 === 0;

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (edge(x) || edge(y) || rightEdge(x) || bottomEdge(y) || indestructibleBlock(x, y)) {
                    this.gameMap[y][x] = 1;
                }
            }
        }
    }

    private bookCorners() {
        for (const [x, y] of this.corners) {
            this.gameMap[y][x] = 8;
        }
    }

    private placeIndestructibleBlocks(count: number) {
        let placedBlocks = 0;

        while (placedBlocks < count) {
            const x = Math.floor(Math.random() * this.mapWidth);
            const y = Math.floor(Math.random() * this.mapHeight);

            if (this.gameMap[y][x] !== 1 && this.gameMap[y][x] !== 5) {
                this.gameMap[y][x] = 2;
                placedBlocks++;
            }
        }
    }

    private freeCorners() {
        for (const [x, y] of this.corners) {
            this.gameMap[y][x] = 0;
        }
    }

    placePlayers(players: gamePlayer[]) {
        const cornerCoordinates = [
            [1, 1],
            [13, 11],
            [1, 11],
            [13, 1],
        ];
        let player = 3;

        for (let i = 0; i < players.length; i++) {
            const [x, y] = cornerCoordinates[i];
            this.gameMap[y][x] = player;
            players[i].setPosition(x, y)
            player++
        }
    }
}