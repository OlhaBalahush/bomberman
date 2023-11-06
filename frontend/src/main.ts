import { usernameView } from "./views/usernameView";
import { lobbyView } from "./views/lobbyView";
import { errorView } from "./views/errorView";
import { gameView } from "./views/gameView";


//add your route here
const Routes = {
    "/": usernameView,
    "/waiting-room": lobbyView,
    "/error": errorView,
    "/game": gameView
}

export const navigateTo = (pathname:string)=>{
    var e = document.body
    var child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    } 
    window.history.pushState({}, pathname, window.location.origin + pathname);
    document.body.appendChild(Routes[pathname]().element)
}

const currentURL = document.location.pathname

if (Routes[currentURL]) {
    navigateTo(currentURL)
} else {
    document.body.appendChild(Routes['/error']().element);
}