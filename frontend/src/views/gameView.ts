import { createDOMElement, useStateManager } from "mini-framework";

export const gameView = () => {




    return createDOMElement("div", { class: "min-h-screen flex items-center justify-center bg-neutral-600" }, [
        createDOMElement("div", { class: "flex-column  bg-neutral-200  p-12 w-[600px] h-[400px] shadow-md border-4 border-black text-center", id: "gameBox" }, [
            createDOMElement("div", { class: "flex-column bg-container" }, [])// TODO create the top bar

        ])
    ]);

}


// exmpl:  createDOMElement("div", {}, [])