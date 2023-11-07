import { createDOMElement, useStateManager } from "mini-framework";
import { sendEvent } from "../websocket";
import { navigateTo } from "../main";
import { ChatMessage, MovePlayer, GameClientIinput } from "../models/wsMessage";
import { WsMessageTypes } from "../models/constants";
import { renderMap } from "../map";

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

    const handleSumbit = (e) => {
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

    function MovePlayer(data: MovePlayer) {
        console.log("data received to move player: " + data)
    }


    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            // send left movement

        } else if (event.key === 'ArrowRight') {
            // send right movement
        } else if (event.key === 'ArrowUp') {
            // send up movement
        } else if (event.key === 'ArrowDown') {
            // send down movement
        }

        const gameId = sessionStorage.getItem("gameID")
        if (!gameId) {
            console.log("no game ID available")
            return
        }

        const playerID = sessionStorage.getItem("playerID")


        // const payload: GameClientIinput = {
        //     gameID: gameId,

        // }
        // sendEvent(WsMessageTypes.GameInput, payload)
    });



    return createDOMElement("div", { class: "w-screen h-screen flex items-center justify-center bg-neutral-600" }, [
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
                        createDOMElement("input", { class: "w-[260px] h-[40px] mt-4 p-1 border-2 border-black", placeholder: "Enter your message..." }, []).onKeyUp$((e) => { handleSumbit(e) }) // Input box
                    ]) // Inner container
                ]), // Chat bar on the left

                createDOMElement("div", { class: "w-[900px] bg-neutral-200" }, [map]) // Game view
            ])
        ])
    ]);
}




// exmpl:  createDOMElement("div", {}, [])