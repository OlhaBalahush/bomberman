import WebSocket from "ws";
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
        const newPlayer = new gamePlayer(connection);
        clientsHashMap.set(newPlayer.id, newPlayer);
        addPlayerToLobby(newPlayer);
        console.log(`WS: new client connected, id: ${newPlayer.id}`);
        //all messages must be in JSON format
        connection.on("message", (message: string) => handleClientMessages(message))
        //TODO: handle possible disconnection in all steps of player journey 
        connection.on("close", () => {
            handleClientDisconnect(newPlayer.id)
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
    if (!lobbyToJoin) {
        const newLobby: Lobby = new Lobby();
        newLobby.addPlayer(player);
        lobbiesHashMap.set(newLobby.id, newLobby);
        newLobby.broadcastPlayerCountChange();
        return;
    } 

    lobbyToJoin?.addPlayer(player);
    WriteMessage({
        type: WsMessageTypes.LobbyJoinSuccess,
        payload:{
            clientID: player.id
        }
    }, player)

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

function startGame(lobby: Lobby): void {
    const newGame = new Game();
    gamesHashMap.set(newGame.id, newGame)

    for (const player of lobby.players) {
        newGame.addPlayer(player);
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

// is this necessary, basically the same as broadcastmessage
export async function broadcastMessageToGamePlayers(message: wsEvent, players: gamePlayer[]) {
    for (const player of players) {
        try {
            if (player) {
                WriteMessage(message, player)
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
