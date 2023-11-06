import { navigateTo } from "./main";
import { WsMessageTypes } from "./models/constants";

export let socket:WebSocket

export const connectWS= () => {
    socket = new WebSocket("ws://localhost:8080/ws")

    socket.onopen = (event) => {
        console.log('WebSocket connection is open:', event);

        //TODO: send a message to backenc with the Players username
        const PlayersUsername = sessionStorage.getItem('username');

        if (PlayersUsername) {
            sendEvent("",{Username:PlayersUsername})
        } else {
            sendEvent("", { error: "error getting players username" })
        }
    };

    //TODO make sure that everything here works properly because currently it is full of placeholders
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('WebSocket message received:', data);
        const eventData = data.payload
        switch (data.type) {
            case WsMessageTypes.EnterLobby:
                const playerCountContainer = document.getElementById("playerCount")
                const playerCount = eventData.playerCount

                if (playerCountContainer) {
                    playerCountContainer.innerText = playerCount + " user(s) in the lobby right now"
                }

                break;
            case WsMessageTypes.TwentySecondTimer:
                const timerSeconds = eventData.seconds
                const fristTimerText = document.getElementById("firstTimer")
                let isHidden = true;

                if (fristTimerText) {
                    isHidden = fristTimerText.classList.contains('hidden');
                }

                if (isHidden && fristTimerText) {
                    fristTimerText.classList.toggle('hidden');
                }

                if (fristTimerText) {
                    fristTimerText.innerText = "the countdown will begin in " + String(timerSeconds) + " seconds"
                }

                break
            case WsMessageTypes.TenSecondTimer:
                const timerseconds = eventData.seconds

                const secondTimer = document.getElementById("secondTimer")

                const previousTimer = document.getElementById("firstTimer")

                let isSecondHidden = true;

                if (previousTimer && !previousTimer.classList.contains("hidden")) {
                    previousTimer.classList.toggle("hidden")
                }

                //if there are less than 2 people in the lobby all of a sudden:
                if (eventData.seconds === -1) {
                    if (secondTimer && !secondTimer.classList.contains('hidden')) {
                        secondTimer.classList.toggle('hidden');
                    }
                    break
                }

                if (secondTimer) {
                    isSecondHidden = secondTimer.classList.contains('hidden');
                }

                if (isSecondHidden && secondTimer) {
                    secondTimer.classList.toggle('hidden');
                }

                if (secondTimer) {
                    secondTimer.innerText = "the game will start in " + String(timerseconds) + " seconds"
                }

                break
            case WsMessageTypes.StartGame:
                sessionStorage.setItem("gameID", eventData.gameID)
                navigateTo("/game")
                break
            case WsMessageTypes.ChatMessage:
                const message = new CustomEvent("newMessage", {detail:eventData})
                document.dispatchEvent(message)
                break
            default:
                console.log("error unknow ws connection message type: ", event.type)
        }
    };

    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log('WebSocket connection closed cleanly, code:', event.code, 'reason:', event.reason);
        } else {
            console.error('WebSocket connection abruptly closed');
        }
    };

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
});

}

export const sendEvent = (type:string, payload:any) => {
    socket.send(JSON.stringify({type,payload}) )
}