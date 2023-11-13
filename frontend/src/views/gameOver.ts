import { createDOMElement } from "mini-framework";
import { navigateTo } from "../main";
import { sendEvent, socket } from "../websocket";
import { WsMessageTypes } from "../models/constants";

export const gameOver = () => {
    const exitGame = (e) => {
        e.preventDefault()
        socket.close()
        navigateTo("/")
        return
    }

    const restartGame = (e) => {
        e.preventDefault()
        sendEvent(WsMessageTypes.RestartGame, {
            username: sessionStorage.getItem("username"),
            clientID: sessionStorage.getItem("clientID")
        })
        return
    }

    document.addEventListener(WsMessageTypes.GameOver, ((e: CustomEvent) => {
        const ele = document.getElementById("gameOverContainer")
        ele?.classList.remove("hidden")
        const text = document.getElementById("gameOverText")
        if (text) text.innerHTML = e.detail.message
    }) as EventListener)

    return createDOMElement("div", {
        id: "gameOverContainer",
        class: "hidden w-[600px] h-[300px] bg-neutral-200 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-solid border-black flex flex-col gap-5 items-center justify-center z-50"
    }, [
        createDOMElement("h1", {
            id: "gameOverText",
            class: "font-mono text-6xl font-normal text-black uppercase text-center"
        }, ["MESSAGE HERE"]),
        createDOMElement("form", {
            class: "flex flex-col gap-5 items-center justify-center"
        }, [
            createDOMElement("button", {
                class: "w-[260px] h-[40px] bg-neutral-200 font-mono text-xl font-normal text-black uppercase border-2 border-solid border-black",
                maxLength: 20,
                required: true,
            }, ["restart"])
                .onClick$(restartGame),
            createDOMElement("button", {
                class: "w-[260px] h-[40px] bg-neutral-200 font-mono text-xl font-normal text-black uppercase border-2 border-solid border-black",
                type: "submit"
            }, ["exit"])
                .onClick$(exitGame)
        ]),
    ])
}