import { createDOMElement, useStateManager } from "mini-framework";
import { connectWS } from "../websocket";
import { navigateTo } from "../main";
import { EnterLobbyServerMessage, TimerUpdates, wsEvent } from "../models/wsMessage";

export let TimerCountDown = useStateManager("0")


export const lobbyView = () => {

    let playerCountInLobby = useStateManager("1")

    if(!sessionStorage.getItem("username")){
        navigateTo("/")
        return
    }
    
    connectWS()

    const HTML = createDOMElement("div", {
        class: "min-h-screen flex items-center justify-center bg-neutral-600"
    }, [createDOMElement("div", { class: "flex-column  bg-neutral-200  p-12 w-[600px] shadow-md border-4 border-black text-center" }, [
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

export function addPlayerCount(eventData:EnterLobbyServerMessage){
    const playerCountContainer = document.getElementById("playerCount")
    const playerCount = eventData.playerCount

    if (playerCountContainer) {
        playerCountContainer.innerText = playerCount + " user(s) in the lobby right now"
    }
}

export function twentySecondTimer(eventData:TimerUpdates){
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
}

export function tenSecondTimer(eventData:TimerUpdates){
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
        return
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

}

// exmpl:  createDOMElement("div", {}, [])