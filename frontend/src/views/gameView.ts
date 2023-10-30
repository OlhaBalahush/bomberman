import { createDOMElement, useStateManager } from "mini-framework";

export const gameView = () => {


    let gameTime = useStateManager("240") //TODO connect with be
    let PlayerHealth = useStateManager("3")//TODO connect with be


    const makeChatMessage = (msgSender: string, msgText: string) => {
        return createDOMElement("div", { class: "flex mb-1 ml-0 mr-0 mt-0 mb-2" }, [
            createDOMElement("div", { class: "text-neutral-600" }, [msgSender + ":"]),
            createDOMElement("div", { class: "" }, [msgText])
        ]);
    }


    //TODO: add ws logic here:
    const chatWsSocket = new WebSocket("ws://localhost:8080/chat");

    chatWsSocket.addEventListener('open', (event) => {

    });


    chatWsSocket.addEventListener('message', (event) => {
        switch (event.type) {
            case "message":
                //save the message to the chat history
                const chatHisotryContainer = document.getElementById("chat-history")

                if (chatHisotryContainer) {
                    chatHisotryContainer.appendChild(makeChatMessage(event.data.sender, event.data.message)) // TODO: make sure this works afte BE is done.
                }
                break
        }
    })

    chatWsSocket.addEventListener('close', (event) => {
        console.log("chat ws connection closed")
    });

    const handleSumbit = (e) => {
        console.log("key:", e.key)
        console.log("value:", e.value)
        if (e.key === "Enter") {
            //send message to BE
            console.log("trying to send message: ", e.target.value)
            chatWsSocket.send(JSON.stringify({ type: "message", data: { sender: sessionStorage.getItem("username"), message: e.target.value } })) //TODO: make sure this works after BE is done.
            e.target.value = ""
        }
    }

    return createDOMElement("div", { class: "w-screen h-screen flex items-center justify-center bg-neutral-600" }, [
        createDOMElement("div", { class: "w-[1200px] h-[1024px] border-1 border-black flex flex-col", id: "gameBox" }, [
            createDOMElement("div", { class: "h-[57px] bg-neutral-200 border-2 border-black p-2 flex items-center" }, [
                createDOMElement("div", { class: "pr-4 font-inter text-2xl font-normal text-black uppercase flex-none" }, ["TIME: " + gameTime.getState()]),
                createDOMElement("div", { class: "font-inter text-2xl font-normal text-black uppercase flex-auto text-center" }, ["lives: " + PlayerHealth.getState()])
            ]), // Top bar

            createDOMElement("div", { class: "flex h-[780px]" }, [
                createDOMElement("div", { class: "w-[300px] flex flex-col bg-neutral-200 border-2 border-black", id: "outter-chat-container" }, [
                    createDOMElement("div", { class: "h-[60px] border-b border-black flex items-center justify-center font-inter text-3xl font-normal text-black uppercase" }, ["chat"]), // Chat text
                    createDOMElement("div", { class: "p-4 flex-1" }, [
                        createDOMElement("div", { class: "h-[620px] flex flex-col justify-end border-2 border-black p-4 overflow-y-scroll", id: "chat-history" },
                            [makeChatMessage("user1", "this is my first message"), makeChatMessage("user2", "hello, nice to meet you user 1")]), // Chat history //todo: remove the templates
                        createDOMElement("input", { class: "w-[260px] h-[40px] mt-4 border-2 border-black", placeholder: "Enter your message," }, []).onKeyUp$((e) => { handleSumbit(e) }) // Input box
                    ]) // Inner container
                ]), // Chat bar on the left

                createDOMElement("div", { class: "w-[900px] bg-neutral-200 border-2 border-black p-2" }, ["Game view"]) // Game view
            ])
        ])
    ]);
}




// exmpl:  createDOMElement("div", {}, [])