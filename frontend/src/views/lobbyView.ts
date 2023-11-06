import { createDOMElement, useStateManager } from "mini-framework";

export const lobbyView = () => {

    const socket = new WebSocket("ws://localhost:8080/ws")

    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection has been established');
    });

    socket.addEventListener('message', (event) => {
        const messageData = JSON.parse(event.data)

        switch (messageData.type) {
            case "connect":
                const clientId = messageData.clientID;
                sessionStorage.setItem("clientID", clientId)

                const username = sessionStorage.getItem("username")
                socket.send(JSON.stringify({ "type": "enterLobby", "clientID": clientId, "username": username }))

                break;

            case "enterLobby":
                const playerCountContainer = document.getElementById("playerCount")
                const playerCount = messageData.playerCount

                if (playerCountContainer) {
                    playerCountContainer.innerText = playerCount + " user(s) in the lobby right now"
                }

                break;

            case "startTwentySecondTimer":
                const timerSeconds = messageData.seconds
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

            case "startTenSecondTimer":
                const timerseconds = messageData.seconds

                const secondTimer = document.getElementById("secondTimer")

                const previousTimer = document.getElementById("firstTimer")

                let isSecondHidden = true;

                if (previousTimer && !previousTimer.classList.contains("hidden")) {
                    previousTimer.classList.toggle("hidden")
                }

                //if there are less than 2 people in the lobby all of a sudden:
                if (messageData.seconds === -1) {
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

            case "startGame": {
                //todo init game from here
                //most likely just redirect, but maybe something else needs to be done as well
                window.location.href = "http://localhost:8080/game"
            }

            default:
                console.log("error unknow ws connection message type: ", messageData.type)
        }
    });

    socket.addEventListener('close', (event) => {
        if (event.wasClean) {
            console.log('WebSocket connection closed cleanly, code:', event.code, 'reason:', event.reason);
        } else {
            console.error('WebSocket connection abruptly closed');
        }
    });

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

    const HTML = createDOMElement("div", {
        class: "min-h-screen flex items-center justify-center bg-neutral-600"
    }, [createDOMElement("div", { class: "flex-column  bg-neutral-200  p-12 w-[600px] h-[400px] shadow-md border-4 border-black text-center" }, [
        createDOMElement("div", { class: "font-mono text-6xl font-normal text-black uppercase" }, ["Waiting Room"]),
        createDOMElement("div", { class: "pt-7 font-mono text-1xl font-normal text-black uppercase", id: "playerCount" }, []),
        createDOMElement("div", { class: "py-3 font-mono text-1xl font-normal text-black uppercase" }, ["the game will start when at least 2 players are in the lobby"]),
        createDOMElement("div", { class: "py-4 flex items-center justify-center" }, [
            createDOMElement("img", { src: "https://i.gifer.com/ZKZg.gif", class: "self-center w-[100px] h-[100px]" }, [])
        ]),
        createDOMElement("div", { class: "hidden font-mono text-1xl font-normal text-black uppercase", id: "firstTimer" }, []),
        createDOMElement("div", { class: "hidden font-mono text-1xl font-normal text-black uppercase", id: "secondTimer" }, [])
    ])])

    return HTML
}


// exmpl:  createDOMElement("div", {}, [])