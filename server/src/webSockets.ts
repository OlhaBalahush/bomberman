import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import http from 'http';
import { WebsocketEvents } from './constants'
import { Lobby } from "./lobby";
import { Player } from "./player";
import { WsClientMessage, WsServerMessage } from "./models/wsMessage"

//storing all clients that are connected
const clientsHashMap = new Map<string, WebSocket>();
const lobbiesList: Lobby[] = [];

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
        "type": WebsocketEvents.Connect,
        "clientId": clientId
    }

    // send back the connected message to client, client needs to include the id to all future message to be able to identify the connection later
    connection.send(JSON.stringify(payLoad))

    console.log(`WS: new client connected, id: ${clientId}`);
    return clientId;
}

function handleClientMessages(message: string) {
    try {
        const messageJSON: WsClientMessage = JSON.parse(message);
        console.log("WS message from client: " + message);

        switch (messageJSON.type) {
            //client sends enterLobby message after player enters username
            case WebsocketEvents.EnterLobby: {
                const clientId: string = messageJSON.clientId;
                const username: string = messageJSON.username;

                const newPlayer: Player = new Player(clientId, username);
                //adding player to (new or alredy existing non-full) lobby
                const lobbyEntered: Lobby = addPlayerToLobby(newPlayer);

                //notifying clients about new player joining lobby + new count of players in lobby
                const messagePayLoad: WsServerMessage = {
                    "type": WebsocketEvents.EnterLobby,
                    "player": newPlayer.getData(),
                    "playerCount": lobbyEntered.getCountOfPlayers(),
                }

                broadcastMessage(messagePayLoad, lobbyEntered.players)

                break;
            }
            default: {
                break;
            }
        }
    } catch (error) {
        console.error("Unable to parse message, check the format : ", error)
        return
    }
}

function addPlayerToLobby(player: Player): Lobby {

    const lobbyToJoin = findEmptyLobby();
    //create new lobby if there are none available
    if (findEmptyLobby() === null) {
        const lobbyId: string = uuidv4();
        const newLobby: Lobby = new Lobby(lobbyId);
        newLobby.addPlayer(player);
        lobbiesList.push(newLobby);
        return newLobby;
    } else {
        lobbyToJoin?.addPlayer(player);
    }
    return lobbyToJoin as Lobby;
}

function findEmptyLobby(): Lobby | null {
    if (lobbiesList.length === 0) {
        return null;
    }

    for (const lobby of lobbiesList) {
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

function handleClientDisconnect(clientId: string) {
    clientsHashMap.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
    //TODO: remove player from lobby, game, chat, send update to other clients in the same lobby,game,chat
}

//TODO:

// when 2 users in waitingroom, timer should start - backend driven, when timer runs out backend sends message to frontend to start game
// backend - create new game after timer runs out, send game id and initial game state to frontend (user positions, map? and probably more info) 
// also create new chat together with game start, send chat id to frontend

//during game game status events from frontend, backend sends info to all connections related to that game
//chat updates sent to the connections related to the chat id
