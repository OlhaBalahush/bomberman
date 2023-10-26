import { createDOMElement, useStateManager } from "mini-framework";

export const lobbyView = () => {


    let playerCountInLobby = 1

    const HTML = createDOMElement("div", {
        class: "min-h-screen flex items-center justify-center bg-neutral-600"
    }, [createDOMElement("div", { class: "flex-column  bg-neutral-200  p-12 w-[600px] h-[400px] shadow-md border-4 border-black text-center" }, [
        createDOMElement("div", { class: "font-mono text-6xl font-normal text-black uppercase" }, ["Waiting Room"]),
        createDOMElement("div", { class: "py-7 font-mono text-1xl font-normal text-black uppercase" }, ["1 user(s) in the lobby right now"]),
        createDOMElement("div", { class: "py-2 font-mono text-1xl font-normal text-black uppercase" }, ["the game will start when at least 2 players are in the lobby"]),
        createDOMElement("div", { class: "py-4 flex items-center justify-center" }, [
            createDOMElement("img", { src: "https://i.gifer.com/ZKZg.gif", class: "self-center w-[75px] h-[75px]" }, [])
        ])
        // temp
    ])])

    return HTML
}


// exmpl:  createDOMElement("div", {}, [])