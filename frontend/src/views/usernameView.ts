import { createDOMElement, useStateManager } from "mini-framework";
import { connectWS, sendEvent } from "../websocket";
import { navigateTo } from "../main";

export const usernameView = () => {
    const username = useStateManager("")

    const handleChange = (e) => {
        e.preventDefault();
        username.setState(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        sessionStorage.setItem("username", username.getState())
        navigateTo("/waiting-room")
    }

    const startPage = createDOMElement("div", {
        class: "w-screen h-screen bg-neutral-600"
    }, [
        createDOMElement("div", {
            class: "w-[600px] h-[300px] bg-neutral-200 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-solid border-black flex flex-col gap-5 items-center justify-center"
        }, [
            createDOMElement("h1", {
                class: "font-mono text-6xl font-normal text-black uppercase text-center"
            }, ["bomberman"]),
            createDOMElement("form", {
                class: "flex flex-col gap-5 items-center justify-center"
            }, [
                createDOMElement("input", {
                    class: "px-4 w-[260px] h-[40px] bg-neutral-200 border-2 border-solid border-black",
                    placeholder: "Enter your username",
                    maxLength: 20,
                    required: true,
                    value: username.getState()
                }, [])
                    .onChange$(handleChange),
                createDOMElement("button", {
                    class: "w-[260px] h-[40px] bg-neutral-200 font-mono text-xl font-normal text-black uppercase border-2 border-solid border-black",
                    type: "submit"
                }, ["start"])
                    .onClick$(handleSubmit)
            ]),
        ])
    ])
    return startPage;
}