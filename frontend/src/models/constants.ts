export enum WsMessageTypes {
    //TODO: map all ws events
    Connect = "connect",
    EnterLobby = "enterLobby",
    LobbyJoinSuccess = "lobbyJoinSuccess",
    TwentySecondTimer = "startTwentySecondTimer",
    TenSecondTimer = "startTenSecondTimer",
    StartGame = "startGame",
    RestartGame = "restartGame",
    ChatMessage = "chatMessage",
    GameInput = "gameInput",
    PlayerCords = "movePlayer",
    GameOver = "gameOver"
}

