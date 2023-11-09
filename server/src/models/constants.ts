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
    MovePlayer = "movePlayer",
<<<<<<< HEAD
    GameOver = "gameOver"
=======
    BombPlaced = "bombPlaced",
    BombExplosion = "bombExplosion"
>>>>>>> df05599 (bomb BE progress)
}

