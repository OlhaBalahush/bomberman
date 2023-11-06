import { createDOMElement, useStateManager } from "mini-framework";
import { connectWS } from "../websocket";
import { navigateTo } from "../main";

export let TimerCountDown = useStateManager("0")


export const lobbyView = () => {

    let playerCountInLobby = useStateManager("1")
    
    connectWS()

    if(!sessionStorage.getItem("username")){
        navigateTo("/")
        return
    }

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