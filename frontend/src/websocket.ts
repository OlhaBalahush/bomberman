import { TimerCountDown } from "./views/lobbyView";

export const socket = new WebSocket("ws://localhost:8080/ws")


    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection is open:', event);

        //TODO: send a message to backenc with the Players username

        const PlayersUsername = sessionStorage.getItem('username');

        if (PlayersUsername) {
            socket.send(JSON.stringify({ Username: PlayersUsername }));
        } else {
            socket.send(JSON.stringify({ error: "error getting players username" }))
        }

    });




    //TODO make sure that everything here works properly because currently it is full of placeholders
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