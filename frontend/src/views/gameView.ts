import { createDOMElement, useStateManager } from "mini-framework";

export const gameView = () => {

    const getChatHistory = () => {
        //todo: load chat history from ... somewhere?
        return createDOMElement("div", {}, ["this is chat from me to you"])
    }


    const makeChatMessage = (msgSender: string, msgText: string) => {
        return createDOMElement("div", { class: "flex mb-2 ml-1 mr-1 mt-2 mb-2" }, [
            createDOMElement("div", { class: "bg-gray-600 text-white p-2 rounded-l-lg " }, [msgSender + ": "]),
            createDOMElement("div", { class: "bg-gray-300 p-2 rounded-r-lg" }, [msgText])
        ]);
    }


    //TODO: add ws logic here:

    //ws conn here:
    // if message.received === new chat:
    //append chat to chatlist
    const chatHisotryContainer = document.getElementById("chat-history")

    if (chatHisotryContainer) {
        chatHisotryContainer.appendChild(makeChatMessage("test", "test message"))
    }



    let gameTime = useStateManager("240") //TODO connect with be
    let PlayerHealth = useStateManager("3")//TODO connect with be
    let chatHisotry = useStateManager(getChatHistory())


    return createDOMElement("div", { class: "w-screen h-screen flex items-center justify-center bg-neutral-600" }, [
        createDOMElement("div", { class: "w-[1400px] h-[800px] border-1 border-black flex flex-col", id: "gameBox" }, [
            createDOMElement("div", { class: "h-[55px] bg-neutral-200 border-2 border-black p-2 flex items-center" }, [
                createDOMElement("div", { class: "pr-4 font-mono text-2xl font-normal text-black uppercase flex-none" }, ["TIME: " + gameTime.getState()]),
                createDOMElement("div", { class: "font-mono text-2xl font-normal text-black uppercase flex-auto text-center" }, ["lives: " + PlayerHealth.getState()])
            ]), // Top bar

            createDOMElement("div", { class: "flex h-[650px]" }, [
                createDOMElement("div", { class: "w-[300px] flex flex-col bg-neutral-200 border-2 border-black", id: "outter-chat-container" }, [
                    createDOMElement("div", { class: "h-[60px] border-b border-black flex items-center justify-center font-mono text-3xl font-normal text-black uppercase" }, ["chat"]), // Chat text
                    createDOMElement("div", { class: "p-4 flex-1" }, [
                        createDOMElement("div", { class: "h-[525px] flex flex-col-reverse border-2 border-black p-4 overflow-y-scroll", id: "chat-history" }, []), // Chat history //todo: make this work
                        createDOMElement("input", { class: "w-[265.51px] h-[35px] mt-4 border-2 border-black", placeholder: "Enter your message," }, []) // Input box
                    ]) // Inner container
                ]), // Chat bar on the left

                createDOMElement("div", { class: "w-[1100px] bg-neutral-200 border-2 border-black p-2" }, ["Game view"]) // Game view
            ])
        ])
    ]);
}


// exmpl:  createDOMElement("div", {}, [])