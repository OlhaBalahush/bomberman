import { usernameView } from "./views/usernameView";
import { lobbyView } from "./views/lobbyView";


//add your route here
const Routes = {
    "/": usernameView(),
    "/waiting-room": lobbyView(),
}

const currentURL = document.location.pathname

if (Routes[currentURL]) {
    document.body.appendChild(Routes[currentURL].element);
} else {
    console.log("poor path")
}