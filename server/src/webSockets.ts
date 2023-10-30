import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import http from 'http';
import { WsMessageTypes } from './constants'
import { Lobby } from "./Lobby";
import { Player } from "./Player";
import { LobbyTimer } from "./LobbyTimer";
import { WsClientMessage, WsServerMessage } from "./models/wsMessage"

//storing all clients that are connected
const clientsHashMap = new Map<string, WebSocket>();
//all active waitingrooms that have at least one player in it
const lobbiesHashMap = new Map<string, Lobby>();

export function initWsServer(server: http.Server) {
    const wsServer = new WebSocket.Server({ server });

    wsServer.on("connection", (connection: WebSocket) => {
        const clientId: string = handleWsClientConnect(connection);
        //all messages must be in JSON format
        connection.on("message", (message: string) => handleClientMessages(message))
        //TODO: handle possible disconnection in all steps of player journey 
        connection.on("close", () => handleClientDisconnect(clientId))
    })
}

function handleWsClientConnect(connection: WebSocket): string {
    const clientId: string = uuidv4();
    clientsHashMap.set(clientId, connection);

    const payLoad: WsServerMessage = {
        "type": WsMessageTypes.Connect,
        "clientId": clientId
    }

    // sending back the client id which client needs to include in all of the future messages to be able to identify the connection later
    connection.send(JSON.stringify(payLoad))

    console.log(`WS: new client connected, id: ${clientId}`);
    return clientId;
}

function handleClientMessages(message: string) {
    const messageJSON = parseClientMessage(message);
    if (messageJSON) {
        switch (messageJSON.type) {
            //client sends enterLobby message after player enters username
            case WsMessageTypes.EnterLobby: {
                const newPlayer: Player = new Player(messageJSON.clientId, messageJSON.username);
                //adding player to (new or alredy existing non-full) lobby
                const lobbyEntered: Lobby = addPlayerToLobby(newPlayer);
                //notifying clients about change in the number of players in lobby
                lobbyEntered.broadcastPlayerCountChange();
                break;
            }
            default: {
                break;
            }
        }
    }
}

function parseClientMessage(message: string): WsClientMessage | null {
    try {
        const messageJSON: WsClientMessage = JSON.parse(message);
        console.log("WS message from client: " + message);
        return messageJSON;
    } catch (error) {
        console.error("Unable to parse message, check the format:", error);
        return null;
    }
}

function addPlayerToLobby(player: Player): Lobby {
    const lobbyToJoin = findEmptyLobby();
    //create new lobby if there are none available
    if (findEmptyLobby() === null) {
        const lobbyId: string = uuidv4();
        const newLobby: Lobby = new Lobby(lobbyId);
        newLobby.addPlayer(player);
        lobbiesHashMap.set(lobbyId, newLobby);
        return newLobby;
    } else {
        lobbyToJoin?.addPlayer(player);
        //check if 2 players start count
        if (lobbyToJoin?.getCountOfPlayers() === 2) {
            lobbyToJoin.timer.start(
                20,
                lobbyToJoin.broadcastTimerChange,
                () => {
                    //start 10 second timer, if 20 sec finished but less than 4 players in lobby
                    lobbyToJoin.timer.stop();
                    lobbyToJoin.timer.start(10, lobbyToJoin.broadcastTimerChange, startGame);
                });
        }

        if (lobbyToJoin?.getCountOfPlayers() === 4) {
            //start 10 seconds timer
            if (lobbyToJoin.timer) {
                lobbyToJoin.timer.stop();
            }
            lobbyToJoin.timer.start(10, lobbyToJoin.broadcastTimerChange, startGame);
        }
    }
    return lobbyToJoin as Lobby;
}

function startGame() {

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

export function broadcastMessage(message: WsServerMessage, players: Player[]) {
    for (const player of players) {
        try {
            const client = clientsHashMap.get(player.id);
            if (client) {
                client.send(JSON.stringify(message));
            } else {
                console.error(`Client not found for player with id ${player.id}`);
            }
        } catch (error) {
            console.error(`An error occurred while sending message to player with id ${player.id}:`, error);
        }
    }
}

function handleClientDisconnect(clientId: string): void {
    clientsHashMap.delete(clientId);
    console.log(`Client ${clientId} disconnected`);

    // Remove the player from the Lobby's players list & notify remaining clients
    lobbiesHashMap.forEach((lobby, lobbyId) => {
        if (lobby.hasPlayer(clientId)) {
            lobby.removePlayer(clientId);

            if (lobby.getCountOfPlayers() === 0) {
                lobbiesHashMap.delete(lobbyId);
            } else {
                lobby.broadcastPlayerCountChange();
            }
        }
    });

    //TODO: remove player from  game and chat if player belongs to either of those, send update to other clients in the same game,chat
}

//TODO:


// Handle case if player count in lobby goes under 2 during timer

// backend - create new game after timer runs out, send game id and initial game state to frontend (user positions, map? and probably more info) 
// also create new chat together with game start, send chat id to frontend

//during game game status events from frontend, backend sends info to all connections related to that game
//chat updates sent to the connections related to the chat id
