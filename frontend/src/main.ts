import { usernameView } from "./views/usernameView";
import { lobbyView } from "./views/lobbyView";
import { errorView } from "./views/errorView";
import { gameView } from "./views/gameView";


//add your route here
const Routes = {
    "/": usernameView(),
    "/waiting-room": lobbyView(),
    "/error": errorView(),
    "/game": gameView()
}

const currentURL = document.location.pathname

if (Routes[currentURL]) {
    document.body.appendChild(Routes[currentURL].element);
} else {
    document.body.appendChild(Routes['/error'].element);
}