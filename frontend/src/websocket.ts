import { navigateTo } from "./main";
import { WsMessageTypes } from "./models/constants";
import { EnterLobbyServerMessage, TimerUpdates, PlayerCords, BombPlacedServerMessage, BombExplosionServerMessage, ReplaceBlockServerMessage, PlayerDamageServerMessage, ImmunityEnd } from "./models/wsMessage";
import { addPlayerCount, tenSecondTimer, twentySecondTimer, } from "./views/lobbyView";
import { MovePlayer } from "./views/gameView";
import { placeBombOnMap, placeFlames, removeFlames, replaceCellOnMap, handlePlayerLifeLost, disableImmunityAnimation } from "./bomb";

export let socket: WebSocket

export const connectWS = () => {
    socket = new WebSocket("ws://localhost:8080/ws")

    socket.onopen = (event) => {
        console.log('WebSocket connection is open:', event);

        const PlayersUsername = sessionStorage.getItem('username');
        if (PlayersUsername) {
            sendEvent("", { Username: PlayersUsername })
        } else {
            sendEvent("", { error: "error getting players username" })
        }
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('WebSocket message received:', data);
        const eventData = data.payload
        switch (data.type) {
            case WsMessageTypes.LobbyJoinSuccess:
                sessionStorage.setItem("clientID", eventData.clientID)
                navigateTo("/waiting-room")
                break
            case WsMessageTypes.EnterLobby:
                addPlayerCount(eventData as EnterLobbyServerMessage)
                break;
            case WsMessageTypes.TwentySecondTimer:
                twentySecondTimer(eventData as TimerUpdates)
                break
            case WsMessageTypes.TenSecondTimer:
                tenSecondTimer(eventData as TimerUpdates)
                break
            case WsMessageTypes.StartGame:
                sessionStorage.setItem("gameID", eventData.gameID)
                sessionStorage.setItem("map", eventData.map.map(row => row.join(',')).join(','))
                navigateTo("/game")
                break
            case WsMessageTypes.ChatMessage:
                document.dispatchEvent(new CustomEvent("newMessage", { detail: eventData }))
                break
            case WsMessageTypes.GameOver:
                document.dispatchEvent(new CustomEvent(WsMessageTypes.GameOver, { detail: eventData }))
                break
            case WsMessageTypes.PlayerCords:
                const newCords = eventData as PlayerCords
                MovePlayer(newCords)
                break
            case WsMessageTypes.BombPlaced:
                const bombData: BombPlacedServerMessage = eventData;
                placeBombOnMap(bombData.bombLocation);
                break;
            case WsMessageTypes.PlaceFlames:
                let flamesData: BombExplosionServerMessage = eventData;
                placeFlames(flamesData);
                break;
            case WsMessageTypes.RemoveFlames:
                let flames: BombExplosionServerMessage = eventData;
                removeFlames(flames);
                break;
            case WsMessageTypes.ReplaceBlock:
                console.log("entered ReplaceBlock case")
                const mapUpdateData: ReplaceBlockServerMessage = eventData;
                console.log("data that I got:" + mapUpdateData.coordinates, + mapUpdateData.newCellID)
                replaceCellOnMap(mapUpdateData);
                break;
            case WsMessageTypes.PlayerDamage:
                const damagedPlayerData: PlayerDamageServerMessage = eventData;
                handlePlayerLifeLost(damagedPlayerData);
                break;
            case WsMessageTypes.ImmunityEnd:
                const immunityEndData: ImmunityEnd = eventData;
                disableImmunityAnimation(immunityEndData);
                break;
            default:
                console.log("error unknow ws connection message type: ", event.type)
        }
    };

    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log('WebSocket connection closed cleanly, code:', event.code, 'reason:', event.reason);
        } else {
            console.error('WebSocket connection abruptly closed');
        }
    };

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

}

export const sendEvent = (type: string, payload: any) => {
    socket.send(JSON.stringify({ type, payload }))
}