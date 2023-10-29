import { createDOMElement, useStateManager } from "mini-framework";

export const gameView = () => {

    let gameTime = useStateManager("240") //TODO connect with be
    let PlayerHealth = useStateManager("3")//TODO connect with be


    return createDOMElement("div", { class: "w-screen h-screen flex items-center justify-center bg-neutral-600" }, [
        createDOMElement("div", { class: "p-0 w-[1400px] h-[800px]  border-1 border-black flex flex-col", id: "gameBox" }, [
            createDOMElement("div", { class: "h-[55px] flex content-center bg-neutral-200 border-black border-2 p-2 center-text" }, [
                createDOMElement("div", { class: "pr-[550px] font-mono text-2xl font-normal text-black uppercase" }, ["TIME: " + gameTime.getState()]),
                createDOMElement("div", { class: "font-mono text-2xl font-normal text-black uppercase" }, ["lives: " + PlayerHealth.getState()])
            ]),// TODO create the top bar
            createDOMElement("div", { class: "flex h-[650px]" }, [
                createDOMElement("div", { class: "w-[300px] flex flex-col bg-neutral-200  border-black border-2", id: "outter-chat-container" }, [
                    createDOMElement("div", {
                        class: ["h-[60px] border-b border-black flex items-center justify-center font-mono text-3xl font-normal text-black uppercase"
                        ]
                    }, ["chat"]),//chat text
                    createDOMElement("div", { class: "p-4" }, [
                        createDOMElement("div", { class: " h-[500px] bg-neutral-600 mb-12" }, []), // chat history
                        createDOMElement("input", { class: "border-4 border-black" }, []) // input box
                    ]) //inncer container
                ]),// TODO create chat bar on he left
                createDOMElement("div", { class: "w-[1100px] bg-neutral-200 border-black border-2 p-2 " }, ["Game view"]),// TODO create game view
            ])

        ])
    ]);

}


// exmpl:  createDOMElement("div", {}, [])