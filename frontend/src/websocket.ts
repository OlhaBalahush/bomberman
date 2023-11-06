import { navigateTo } from "./main";
import { TimerCountDown } from "./views/lobbyView";


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
            case "startTwentySecondTimer":
                TimerCountDown.setState(event.data)

                const fristTimerText = document.getElementById("firstTimer")

                let isHidden = true;

                if (fristTimerText) {
                    isHidden = fristTimerText.classList.contains('hidden');
                }
                if (isHidden && fristTimerText) {
                    fristTimerText.classList.toggle('hidden');
                }
                if (!isHidden && event.data === "0" && fristTimerText) {
                    fristTimerText.classList.toggle('hidden');
                }
                //TODO add logic here to show the countdown from 20 with message:
                // "20 seconds untill the countdown"
                break
            case "startTenSecondTimer":
                TimerCountDown.setState(event.data)

                const secondTimer = document.getElementById("secondTimer")

                let isSecondHidden = true;

                if (secondTimer) {
                    isSecondHidden = secondTimer.classList.contains('hidden');
                }
                if (isSecondHidden && secondTimer) {
                    secondTimer.classList.toggle('hidden');
                }
                //TODO add logic here to show the countdown from 10 seconds with the message:
                // "ten seconds untill game will start..."
                break
            case "startGame":
                sessionStorage.setItem("gameID", eventData.gameID)
                navigateTo("/game")
                break
            case "dispatchChatMessage":
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