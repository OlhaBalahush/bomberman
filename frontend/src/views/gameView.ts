import { createDOMElement, useStateManager } from "mini-framework";
import { sendEvent } from "../websocket";
import { navigateTo } from "../main";
import { ChatMessage, PlayerCords, GameClientIinput } from "../models/wsMessage";
import { WsMessageTypes } from "../models/constants";
import { renderMap } from "../map";
import { peers } from "../map"
import { gameOver } from "./gameOver";


export function MovePlayer(data: PlayerCords) {
    //delete player from previous location:
    const previousBlock = document.getElementById(`character-${data.playerIndex}`)
    let previousClassnames: string[] = []

    if (previousBlock) {
        //to keep the damaged animation in place during player movement
        previousClassnames = Array.from(previousBlock.classList);
        previousBlock.remove();
    } else {
        console.log("error remvoing player from previous position")
    }

    //draw player at new position:
    const newBlockElement = document.getElementById(`cell-${data.futurePosition.x}-${data.futurePosition.y}`)
    if (newBlockElement) {
        const playerElement = createDOMElement("img", { src: peers[data.playerIndex], alt: "", class: previousClassnames.join(" "), id: `character-${data.playerIndex}` }, [])
        newBlockElement.appendChild(playerElement.element)
    } else {
        console.log("error in adding new player to pos")
    }
}

export const gameView = () => {
    let gameTime = useStateManager("240") //TODO connect with be
    let PlayerHealth = useStateManager("3")//TODO connect with be
    let chatHistory: ChatMessage[] = [];
    const flatmap = sessionStorage.getItem("map");

    if (!sessionStorage.getItem("gameID") || !flatmap) {
        navigateTo("/")
        return
    }

    const makeChatMessage = (msgSender: string, msgText: string) => {
        return createDOMElement("div", { class: "flex mb-1 ml-0 mr-0 mt-0 mb-2" }, [
            createDOMElement("div", { class: "text-neutral-600" }, [msgSender + ":"]),
            createDOMElement("div", { class: "" }, [msgText])
        ]);
    }

    const handleSumbit = (e: any) => {
        if (e.key === "Enter") {
            //send message to BE
            if (e.target.value === "") return
            console.log("trying to send message: ", e.target.value)
            sendEvent(WsMessageTypes.ChatMessage, { sender: sessionStorage.getItem("username"), content: e.target.value, gameID: sessionStorage.getItem("gameID") })
            e.target.value = ""
        }
    }

    document.addEventListener('newMessage', ((e: CustomEvent) => {
        chatHistory.push(e.detail)
        let history: HTMLElement[] = []

        chatHistory.forEach((message) => {
            history.push(makeChatMessage(message.sender, message.message).element)
        })

        const chat = document.getElementById("chat-history")
        const newChat = createDOMElement("div", { class: "h-[620px] flex flex-col justify-end border-2 border-black p-4 overflow-y-scroll", id: "chat-history" }, history)
        const parentElement = chat?.parentNode
        if (parentElement?.parentNode && chat) parentElement.replaceChild(newChat.element, chat)
    }) as EventListener)

    const map = renderMap(flatmap)

    document.addEventListener('keydown', (event) => {
        //check if user in focused into the game and not into the chat:
        const chatInput = document.getElementById("chat-input")

        if (document.activeElement === chatInput) {
            return
        }

        const validMoves: Record<string, string> = {
            "a": "a",
            "s": "s",
            "d": "d",
            "w": "w",
            //spacebar
            " ": "spacebar"
        }

        let key: string;

        if (validMoves[event.key]) {
            key = event.key
        } else {
            // console.log("no correct key pressed")
            return
        }

        const gameID = sessionStorage.getItem("gameID")
        if (!gameID) {
            console.log("no game ID available")
            return
        }

        const playerID = sessionStorage.getItem("clientID")
        if (!playerID) {
            console.log("no player ID available")
            return
        }

        if (key == " ") {
            sendEvent(WsMessageTypes.BombPlaced, {
                gameID: gameID,
                playerID: playerID
            })
            return;
        }

        const payload: GameClientIinput = {
            gameID: gameID,
            userID: playerID,
            key: key,
        }

        sendEvent(WsMessageTypes.GameInput, payload)
    });


    return createDOMElement("div", { class: "w-screen h-screen flex items-center justify-center bg-neutral-600" }, [
        gameOver(),
        createDOMElement("div", { class: "border-1 border-black flex flex-col", id: "gameBox" }, [
            createDOMElement("div", { class: "h-[57px] bg-neutral-200 border-2 border-black p-2 flex items-center" }, [
                createDOMElement("div", { class: "pr-4 font-inter text-2xl font-normal text-black uppercase flex-none" }, ["TIME: " + gameTime.getState()]),
                createDOMElement("div", { class: "font-inter text-2xl font-normal text-black uppercase flex-auto text-center" }, ["lives: " + PlayerHealth.getState()])
            ]), // Top bar

            createDOMElement("div", { class: "flex h-[780px]" }, [
                createDOMElement("div", { class: "w-[300px] flex flex-col bg-neutral-200 ", id: "outter-chat-container" }, [
                    createDOMElement("div", { class: "h-[60px] border-2 border-black flex items-center justify-center font-inter text-3xl font-normal text-black uppercase" }, ["chat"]), // Chat text
                    createDOMElement("div", { class: "p-4 flex-1 border-2 border-black" }, [
                        createDOMElement("div", { class: "h-[620px] flex flex-col justify-end border-2 border-black p-4 overflow-y-scroll", id: "chat-history" }),
                        createDOMElement("input", { class: "w-[260px] h-[40px] mt-4 p-1 border-2 border-black", id: "chat-input", placeholder: "Enter your message..." }, []).onKeyUp$((e: any) => { handleSumbit(e) }) // Input box
                    ]) // Inner container
                ]), // Chat bar on the left

                createDOMElement("div", { class: "w-[900px] bg-neutral-200" }, [map]) // Game view
            ])
        ])
    ]);
}
// exmpl:  createDOMElement("div", {}, [])