import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import http from 'http';
import { WebsocketEvents } from './constants'

//storing all clients that are connected
//TODO: datatype change based on classes to be created
const clientsHashMap = new Map<string, WebSocket>();
//const gamesHashMap = new Map<string, Game>();
//separate hashmap for waitingrooms (and chats?)

export function initWsServer(server: http.Server) {
    const wsServer = new WebSocket.Server({ server });

    wsServer.on("connection", (connection: WebSocket) => {
        handleWsClientConnect(connection);
        // connection.on("message", (message: string) => handleClientMessages(message))
        //TODO: handle possible disconnection in all steps of player journey 
        connection.on("close", () => console.log("Client disconnected"))
    })
}

function handleWsClientConnect(connection: WebSocket) {
    const clientId: string = uuidv4();
    clientsHashMap.set(clientId, connection);

    const payLoad = {
        "type": WebsocketEvents.Connect,
        "clientId": clientId
    }

    // send back the connected message to client, client needs to include the id to all future message to be able to identify the connection later
    connection.send(JSON.stringify(payLoad))

    console.log(`WS: new client connected, id: ${clientId}`);
}

// function handleClientMessages(message: string) {
//     const messageJSON = JSON.parse(message);
//     console.log(messageJSON);

//     //TODO: Implement handling different type of client messages
//     switch (messageJSON.type) {
//         // example
//         case "create": {
//             const clientId: string = messageJSON.clientId;
//             const gameId: string = uuidv4();
//     //gamesHashMap.set(gameId, { id: gameId, players: [clientId] });

//             const payLoad = {
//                 "type": "create",
//                 "game": gameId
//             }
//             break;
//         }
//         default: {
//             break;
//         }
//     }
// }

export function broadcastMessage() {

}

//TODO:
// user enters nickname on frontend side -> fronted starts ws connection -> backend sends back client id, stores the connection in clients hashmap
// backend creates new waitingroom or add client to existing waitingroom - no need for client to send separate ws message for this probably
// backend sends back data to fronted waitingroom id and users in it (no other info?)
// notify frontend when new player is added to waitingroom

// when 2 users in waitingroom, timer should start - on frontend? If frontend - when timer runs out, frontend sends message to backend user to join game
// info frome frontend should be: waitingroom id, user info
// initial user position from fronted?
// backend creates game id, adds game to games hashmap 
// if chats in separate hashmap, then also creates new chat with id related to that game

//during game game status events from frontend, backend sends info to all connections related to that game
//chat updates sent to the connections related to the chat id

//handling of lost connections in the middle of any of the steps 
