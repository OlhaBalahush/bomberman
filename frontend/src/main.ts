import { usernameView } from "./views/usernameView";
import { lobbyView } from "./views/lobbyView";
import { errorView } from "./views/errorView";


//add your route here
const Routes = {
    "/": usernameView(),
    "/waiting-room": lobbyView(),
    "/error": errorView(),
}

const currentURL = document.location.pathname

if (Routes[currentURL]) {
    document.body.appendChild(Routes[currentURL].element);
} else {
    console.log("poor path")
}