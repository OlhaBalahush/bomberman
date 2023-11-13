import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import http from 'http';
import { WsMessageTypes } from './models/constants'
import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { ChatClientMessage, GameClientIinput, PlayerCords, EnterLobbyClientMessage, wsEvent, BombPlacedClientMessage } from "./models/wsMessage";
import { wsPlayer } from "./Player";
import { gamePlayer } from "./models/player";
import { Bomb } from "./Bomb";
import { Coordinates } from "./models/helpers";

//storing all clients that are connected
export const clientsHashMap = new Map<string, wsPlayer>();
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
        //all messages must be in JSON format
        connection.on("message", (message: string) => handleClientMessages(message))
        //TODO: handle possible disconnection in all steps of player journey 
        connection.on("close", (e) => {
            console.log("websocket close code: ", e)
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
                    //move the player by sending back new cordinates to the client
                    const eventType: WsMessageTypes = WsMessageTypes.MovePlayer
                    const wsMessage = new wsEvent(eventType, payload)
                    broadcastMessageToGamePlayers(wsMessage, currentGame.players)
                } else {
                    //in this case the user request will be denied, I think we should not send anything back because 
                    //it just uses resources and we wont do anything in FE with that info anyways
                }
                break
            }
            case WsMessageTypes.RestartGame: {
                const message: EnterLobbyClientMessage = messageJSON.payload
                const player = clientsHashMap.get(message.clientID)
                if (player) addPlayerToLobby(player)
                break;
            }
            case WsMessageTypes.BombPlaced: {
                const message: BombPlacedClientMessage = messageJSON.payload;
                const currentGame = gamesHashMap.get(message.gameID);
                const bombOwner = currentGame?.getPlayerById(message.playerID);

                if (!currentGame || !bombOwner) {
                    break;
                }

                const bombLocation = bombOwner.position;

                //can place if player has not reached max bombs or there is no bomb at this location already
                if (bombOwner.canPlaceBomb() && (currentGame.map.getFieldID(bombLocation.x, bombLocation.y) !== 7)) {
                    bombOwner.increaseActiveBombs();
                    new Bomb(bombOwner, currentGame);
                }
                break;
            }
            default: {
                break;
            }
        }
    }
}

function validateUserMove(currentGame: Game | undefined, message: GameClientIinput): PlayerCords | undefined {
    if (!currentGame) {
        console.log("no game found, something went wrong");
        return
    }

    let playerindex = 0

    //finding the user that sent the request
    currentGame.players.forEach((player, index) => {
        if (player.id === message.userID) {
            playerindex = index
        }
    });

    const playersPOS = currentGame.players[playerindex].position
    if (!playersPOS) {
        console.log("no player pos found, this is a problem")
        return
    }

    //these are numbers of either free spots (0), other players (3,4,5,6) or powerups (9,10,11) that the user can walk into:
    const validNumbers = [0, 3, 4, 5, 6, 9, 10, 11]
    //validate the move:
    let validMove = false
    let newCords;
    switch (message.key) {
        case "w":
            //up
            validMove = validNumbers.includes((currentGame.map.getFieldID(playersPOS.x, playersPOS.y - 1)))
            newCords = { x: playersPOS.x, y: playersPOS.y - 1 }
            break;
        case "s":
            //down
            validMove = validNumbers.includes((currentGame.map.getFieldID(playersPOS.x, playersPOS.y + 1)))
            newCords = { x: playersPOS.x, y: playersPOS.y + 1 }
            break;
        case "a":
            //left
            validMove = validNumbers.includes((currentGame.map.getFieldID(playersPOS.x - 1, playersPOS.y)))
            newCords = { x: playersPOS.x - 1, y: playersPOS.y }
            break;
        case "d":
            //right
            validMove = validNumbers.includes((currentGame.map.getFieldID(playersPOS.x + 1, playersPOS.y)))
            newCords = { x: playersPOS.x + 1, y: playersPOS.y }
            break;
        default:
            return
    }

    //if valid, change the map object and player objects position properties to new ones and return payload
    if (validMove) {
        const previousField = currentGame.map.getFieldID(playersPOS.x, playersPOS.y)

        //if bomb was in the previous position, don't change it to 0, keep it 7
        if (previousField !== 7) {
            currentGame.map.setFieldID(playersPOS.x, playersPOS.y, 0);
        }

        currentGame.map.setFieldID(newCords.x, newCords.y, playerindex + 3); // index + 3 because of the way we have the players set up on the map, look at table below

        const payload: PlayerCords = {
            playerIndex: playerindex,
            previousPosition: { x: playersPOS.x, y: playersPOS.y },
            futurePosition: newCords
        }

        currentGame.players[playerindex].setPosition(newCords.x, newCords.y)

        if (currentGame.map.isActiveFlameOnCell(newCords)) {
            currentGame.players[playerindex].loseLife(currentGame, playerindex);
        }

        //check for powerups in the new cords:


        return payload;
    } else {
        return
    }
    //player values:
    //     3: "player1",
    //     4: "player2",
    //     5: "player3",
    //     6: "player4",
}

function parseClientMessage(message: string): wsEvent | null {
    try {
        const messageJSON: wsEvent = JSON.parse(message);
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

    lobbiesHashMap.delete(lobby.id);
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
