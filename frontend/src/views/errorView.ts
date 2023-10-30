import { createDOMElement } from "mini-framework";

export const errorView = () => {

    const handleOk = (e) => {
        e.preventDefault()
        window.location.href = "/"
    }

    const HTML = createDOMElement("div", {
        class: "min-h-screen flex items-center justify-center bg-neutral-600"
    }, [createDOMElement("div", { class: "flex flex-col items-center gap-5  bg-neutral-200  p-12 w-[600px] shadow-md border-4 border-black text-center" }, [
        createDOMElement("img", {class: "", src: "https://cdn.discordapp.com/attachments/1075493710692876330/1168246129796845730/404.png?ex=655110fe&is=653e9bfe&hm=95516ea5aeedc105c20801bc8a8328d18551319fe731b3560811b6945fef0c4b&" }),
        createDOMElement("div", {class: "font-mono text-1xl font-normal text-black uppercase" }, ["not found"]),
        createDOMElement("button", {class: "w-[260px] h-[40px] bg-neutral-200 font-mono text-xl font-normal text-black uppercase border-2 border-solid border-black"}, ["ok"])
            .onClick$((e) => handleOk(e))
        ]) 
    ])

    return HTML
}