# BOMBERMAN-DOM

![GitHub repo size](https://img.shields.io/github/repo-size/OlhaBalahush/bomberman)
![Languages](https://img.shields.io/github/languages/count/OlhaBalahush/bomberman)
![JavaScript](https://img.shields.io/github/languages/top/OlhaBalahush/bomberman)


* [audit questions](https://github.com/01-edu/public/tree/master/subjects/bomberman-dom/audit)

## Objectives

The primary objectives of this project include:

- Create a Bomberman-like game with multiplayer functionality.
- Respect performance principles, ensuring smooth gameplay.
- Implement a chat system using WebSockets.
- Follow the framework developed in the mini-framework project.
- Incorporate power-ups, destructible blocks, and fixed walls in the game map.



### Players

- Number of Players: 2 - 4
- Each player starts with 3 lives.
- Players are placed in the corners of the map.

### Map

- Fixed map visible to all players.
- Two types of blocks: destructible (blocks) and indestructible (walls).
- Destructible blocks generate randomly on the map.
- Ensure players have space in their starting positions to survive bomb explosions.

### Power-ups

- Bombs: Increase the number of bombs dropped at a time by 1.
- Flames: Increase explosion range from the bomb in four directions by 1 block.
- Speed: Increase movement speed.

### Game Flow

1. Players enter a nickname upon opening the game.
2. Players wait on a page with a counter that increments as others join.
3. If there are 4 players before 20 seconds, a 10-second countdown starts.
4. If there are not enough players, a 10-second timer begins when the counter reaches 4.
5. After the timer, the game starts.


## Technologies
* JavaScript
* HTML
* CSS
* NodeJS

## How to run
1. Go to server directory:
```
cd server/
```
2. Install dependencies:
```
npm install
```
3. Run server
```
npm run start
```
4. Open a new terminal and go to frontend directory:
```
cd frontend/
```
3. Install dependencies:
```
npm install
```
4. Run frontend: 
```
npm run start
```

Then playing the game you might be comfused by the movement: <br>
the movement is grid based and in order to meet the requirement of having a speed power up, your movemnt is limited to once every 0,35 seconds... unless you find some powerups hidden in the walls.

## Authors
* [Gert Nõgene](https://01.kood.tech/git/Gert)
* [Karme Bärg](https://01.kood.tech/git/Karme)
* [Elena Khaletska](https://01.kood.tech/git/ekhalets)
* [Olha Balahush](https://01.kood.tech/git/Olya)
* [Taivo Tokman](https://01.kood.tech/git/TaivoT)