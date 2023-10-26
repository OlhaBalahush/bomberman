import { createDOMElement, useStateManager } from "mini-framework";

export const lobbyView = () => {

    let playerCountInLobby = useStateManager("1")
    let TimerCountDown = useStateManager("0")

    //TODO: change this to the correct port and and endpoint
    fetch('https://localhost:8080/GetLobbyCount')
        .then(response => response.json)
        .then(data => {
            console.log(data);
            //TODO save the gotten number to the playercountInLobby variable

        })

    const socket = new WebSocket("ws://localhost:8080/ws")


    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection is open:', event);

        //TODO: send a message to backenc with the Players username

        const PlayersUsername = sessionStorage.getItem('username');

        if (PlayersUsername) {
            socket.send(PlayersUsername);
        } else {
            socket.send("Error getting Players username")
        }

    });

    socket.addEventListener('message', (event) => {
        console.log('WebSocket message received:', event);

        switch (event.type) {
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

            default:
                console.log("error unknow ws connection message type: ", event.type)
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
        createDOMElement("div", { class: "pt-7 font-mono text-1xl font-normal text-black uppercase" }, [playerCountInLobby.getState() + " user(s) in the lobby right now"]),
        createDOMElement("div", { class: "py-3 font-mono text-1xl font-normal text-black uppercase" }, ["the game will start when at least 2 players are in the lobby"]),
        createDOMElement("div", { class: "py-4 flex items-center justify-center" }, [
            createDOMElement("img", { src: "https://i.gifer.com/ZKZg.gif", class: "self-center w-[100px] h-[100px]" }, [])
        ]),
        createDOMElement("div", { class: "hidden font-mono text-1xl font-normal text-black uppercase", id: "firstTimer" }, ["the game will start in " + TimerCountDown.getState() + " second"]),
        createDOMElement("div", { class: "hidden font-mono text-1xl font-normal text-black uppercase", id: "secondTimer" }, ["the countdown will begin in " + TimerCountDown.getState() + " seconds"])
        // temp
    ])])

    return HTML
}


// exmpl:  createDOMElement("div", {}, [])