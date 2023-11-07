import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import http from 'http';
import { WsMessageTypes } from './models/constants'
import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { ChatClientMessage, wsEvent } from "./models/wsMessage";
import { gamePlayer } from "./models/player";

//storing all clients that are connected
const clientsHashMap = new Map<string, gamePlayer>();
//all active waitingrooms that have at least one player in it
const lobbiesHashMap = new Map<string, Lobby>();
const gamesHashMap = new Map<string, Game>();


export function initWsServer(server: http.Server) {
    const wsServer = new WebSocket.Server({ server });
    wsServer.on("connection", (connection: WebSocket) => {
        // client establishes ws connection after entering username
        const clientID: string = uuidv4();
        const newPlayer = new gamePlayer(clientID, connection);
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
            default: {
                break;
            }
        }
    }
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

export function addPlayerToLobby(player: gamePlayer): void {
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
        newGame.addPlayer(player.id, player.conn);
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

export async function broadcastMessage(message: wsEvent, players: gamePlayer[]) {
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

async function WriteMessage(message: wsEvent, player: gamePlayer) {
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
