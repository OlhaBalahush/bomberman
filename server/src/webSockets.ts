import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import http from 'http';
import { WsMessageTypes } from './models/constants'
import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { ChatClientMessage, GameClientIinput, MovePlayer, wsEvent } from "./models/wsMessage";
import { wsPlayer } from "./Player";
import { gamePlayer } from "./models/player";

//storing all clients that are connected
const clientsHashMap = new Map<string, wsPlayer>();
//all active waitingrooms that have at least one player in it
const lobbiesHashMap = new Map<string, Lobby>();
const gamesHashMap = new Map<string, Game>();


export function initWsServer(server: http.Server) {
    const wsServer = new WebSocket.Server({ server });
    wsServer.on("connection", (connection: WebSocket) => {
        // client establishes ws connection after entering username
        const clientID: string = uuidv4();
        const newPlayer = new wsPlayer(clientID, connection);
        clientsHashMap.set(clientID, newPlayer);
        addPlayerToLobby(newPlayer);
        console.log(`WS: new client connected, id: ${clientID}`);
        //all messages must be in JSON format
        connection.on("message", (message: string) => handleClientMessages(message))
        //TODO: handle possible disconnection in all steps of player journey 

        connection.on("close", () => {
            handleClientDisconnect(clientID)
        })
    })
}

async function handleClientMessages(message: string) {
    const messageJSON = parseClientMessage(message);
    if (messageJSON) {
        switch (messageJSON.type) {
            //client sends enterLobby message after player enters username
            case WsMessageTypes.ChatMessage: {
                const message: ChatClientMessage = messageJSON.payload
                const currentGame = gamesHashMap.get(message.gameID)
                currentGame?.addMessage(message.content, message.sender)
                break;
            }
            case WsMessageTypes.GameInput: {
                const message: GameClientIinput = messageJSON.payload
                const currentGame = gamesHashMap.get(message.gameID)
                if (!currentGame) {
                    console.log("no current game found, this is a problem")
                    return
                }
                const payload = validateUserMove(currentGame, message)

                if (payload !== undefined) {
                    const eventType: WsMessageTypes = WsMessageTypes.MovePlayer
                    const wsMessage = new wsEvent(eventType, payload)
                    broadcastMessageToGamePlayers(wsMessage, currentGame.players)

                    // const wsMessage: wsEvent = JSON.stringify
                    // const message = new wsEvent("movePlayer",)
                    //move the player by sending back new cordinates to the client
                } else {
                    //in this case the user request will be denied, I think we should not send anything back because 
                    //it just occupies the connection and we wont do anything in FE with that info anyways
                }
                //handle game input from client, for this I will need:
                // *to know who is the client who sent this, so some sort of ID will be needed - will send it from the FE
                // *the map of the current game that is happening - I got this one with the game ID that will also be sent from the FE

            }
            default: {
                break;
            }
        }
    }
}

function validateUserMove(currentGame: Game | undefined, message: GameClientIinput): MovePlayer | undefined {
    if (!currentGame) {
        console.log("no game found, something is wrong")
        return
    }

    const CURRENTMAP = currentGame.map.gameMap
    //over here I will need to check:
    // * where is the user?
    // *what is the block that they are trying to move to:
    // * can they move to that block?
    let playerindex = 0
    currentGame.players.forEach((player, index) => {
        if (player.id === message.userID) {
            playerindex = index
        }
    });

    //now that I know the players number I can check the example below and find them on the map.
    // playerNumber = playerNumber+2

    const playersPOS = currentGame.players[playerindex].position
    if (!playersPOS) {
        console.log("no player pos found, this is a problem")
        return
    }
    console.log("this is the current players position: ", playersPOS)

    //I need to add the changes to the map object so when a new request comes in it is updated

    //now I have the players position, I should check if the player can move in the desired direction
    // we have 4 keys for that... what is the best way to check.... I think just a switch cas should be fine
    let validMove = false
    let newCords;
    switch (message.key) {
        case "w":
            //up
            validMove = (CURRENTMAP[playersPOS.y - 1][playersPOS.x] === 0)
            newCords = { x: playersPOS.x, y: playersPOS.y - 1 }
            // return (CURRENTMAP[playersPOS.y + 1][playersPOS.x] === 0) ? { x: playersPOS.x, y: playersPOS.y + 1 } : undefined
            break;
        case "s":
            //down
            validMove = (CURRENTMAP[playersPOS.y + 1][playersPOS.x] === 0)
            newCords = { x: playersPOS.x, y: playersPOS.y + 1 }
            // return (CURRENTMAP[playersPOS.y - 1][playersPOS.x] === 0) ? { x: playersPOS.x, y: playersPOS.y - 1 } : undefined
            break;
        case "a":
            //left
            validMove = (CURRENTMAP[playersPOS.y][playersPOS.x - 1] === 0)
            newCords = { x: playersPOS.x - 1, y: playersPOS.y }
            // return (CURRENTMAP[playersPOS.y][playersPOS.x - 1] === 0) ? { x: playersPOS.x - 1, y: playersPOS.y } : undefined
            break;
        case "d":
            validMove = (CURRENTMAP[playersPOS.y][playersPOS.x + 1] === 0)
            newCords = { x: playersPOS.x + 1, y: playersPOS.y }
            // return (CURRENTMAP[playersPOS.y][playersPOS.x + 1] === 0) ? { x: playersPOS.x + 1, y: playersPOS.y } : undefined
            break;
        default:
            return
    }

    if (validMove) {
        console.log("map object before: ", currentGame.map.gameMap)
        currentGame.map.gameMap[playersPOS.y][playersPOS.x] = 0
        currentGame.map.gameMap[newCords.y][newCords.x] = playerindex + 3 // index + 3 becaue of the way we have palyers set up, look at table below'
        console.log("map object after: ", currentGame.map.gameMap)
        console.log("player object pos before: ", currentGame.players[playerindex].position);
        const payload: MovePlayer = {
            playerIndex: playerindex,
            previousPosition: { x: playersPOS.x, y: playersPOS.y },
            cordinates: newCords
        }
        currentGame.players[playerindex].setPosition(newCords.x, newCords.y)
        console.log("player object pos after: ", currentGame.players[playerindex].position);
        return payload;
    } else {
        return
    }

    // I have the palyers, but how can I get the one that sent me the data 

    //     3: "player1",
    //     4: "player2",
    //     5: "player3",
    //     6: "player4",
}

function parseClientMessage(message: string): wsEvent | null {
    try {
        const messageJSON: wsEvent = JSON.parse(message);
        console.log("WS message from client: " + message);
        return messageJSON;
    } catch (error) {
        console.error("Unable to parse message, check the format:", error);
        return null;
    }
}

export function addPlayerToLobby(player: wsPlayer): void {
    const lobbyToJoin = findEmptyLobby();
    let tenSeconds = 10
    //create new lobby if there are none available
    if (findEmptyLobby() === null) {
        const lobbyID: string = uuidv4();
        const newLobby: Lobby = new Lobby(lobbyID);
        newLobby.addPlayer(player);
        lobbiesHashMap.set(lobbyID, newLobby);
        newLobby.broadcastPlayerCountChange();
        return;
    } else {
        lobbyToJoin?.addPlayer(player);
        //notifying clients about change in the number of players in lobby
        lobbyToJoin?.broadcastPlayerCountChange();
        // check if 2 players start count
        if (lobbyToJoin?.getCountOfPlayers() === 2) {
            lobbyToJoin.timer.start(
                // TODO change back to 20s 
                5, // 2 * tenSeconds,
                lobbyToJoin,
                () => {
                    //start 10 second timer, if 20 sec finished but less than 4 players in lobby
                    lobbyToJoin.timer.stop();
                    lobbyToJoin.timer.start(3, //tenSeconds, 
                        lobbyToJoin,
                        startGame
                    );
                });
        }

        if (lobbyToJoin?.getCountOfPlayers() === 4) {
            //start 10 seconds timer when 4th playe joins
            if (lobbyToJoin.timer) {
                lobbyToJoin.timer.stop();
            }
            lobbyToJoin.timer.start(tenSeconds, lobbyToJoin, startGame);
        }
    }
}

function startGame(lobby: Lobby): void {
    const gameID: string = uuidv4();
    const newGame = new Game(gameID);
    gamesHashMap.set(gameID, newGame)

    for (const player of lobby.players) {
        newGame.addPlayer(player.id, player.username ? player.username : "");
    }

    newGame.broadcastGameStart();
}



function findEmptyLobby(): Lobby | null {
    if (lobbiesHashMap.size === 0) {
        return null;
    }

    for (const lobby of lobbiesHashMap.values()) {
        if (!lobby.isFull()) {
            return lobby;
        }
    }

    return null;
}

export async function broadcastMessage(message: wsEvent, players: wsPlayer[]) {
    for (const player of players) {
        try {
            WriteMessage(message, player)
        } catch (error) {
            console.error(`An error occurred while sending message to player with id ${player.id}:`, error);
        }
    }
}

export async function broadcastMessageToGamePlayers(message: wsEvent, players: gamePlayer[]) {
    for (const player of players) {
        const c = clientsHashMap.get(player.id)
        try {
            if (c) {
                WriteMessage(message, c)
            } else {
                throw new Error;
            }
        } catch (error) {
            console.error(`An error occurred while sending message to player with id ${player.id}:`, error);
        }
    }
}

async function WriteMessage(message: wsEvent, player: wsPlayer) {
    const client = clientsHashMap.get(player.id);
    if (client) {
        client.conn.send(JSON.stringify(message));
    } else {
        console.error(`Client not found for player with id ${player.id}`);
    }
}

function handleClientDisconnect(clientID: string): void {
    clientsHashMap.delete(clientID);
    console.log(`Client ${clientID} disconnected`);

    // Remove the player from the Lobby's players list & notify remaining clients
    lobbiesHashMap.forEach((lobby, lobbyID) => {
        if (lobby.hasPlayer(clientID)) {
            lobby.removePlayer(clientID);

            if (lobby.getCountOfPlayers() === 0) {
                lobbiesHashMap.delete(lobbyID);
                return;
            }

            lobby.broadcastPlayerCountChange();

            if (lobby.getCountOfPlayers() === 1 && lobby.timer.isActive()) {
                //Stopping timer if player count in lobby goes under 2 during timer
                lobby.timer.stop();
                lobby.broadcastTimerChange(-1, -1);
            }
        }
    });
}
