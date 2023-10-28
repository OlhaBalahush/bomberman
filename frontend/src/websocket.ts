let clientId: String = "";

export function initWsConnection() {

    const ws = new WebSocket('ws://localhost:8050');

    ws.onopen = (event) => {
        console.log('Connected to server');
    };

    ws.onmessage = (event: MessageEvent<string>) => {
        let messageJSON = JSON.parse(event.data);
        if (messageJSON.type == "connect") {
            clientId = messageJSON.clientId
        }
        console.log(`clientid: ${clientId}`);
        console.log(`Received message from server: ${event.data}`);
    };

}

// function sendJsonMessage(type: string, content: string) {
//     const msg = {
//         type: type,
//         text: content,
//     };

//     return JSON.stringify(msg)
// }