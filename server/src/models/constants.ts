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
<<<<<<< HEAD
    BombExplosion = "bombExplosion"
>>>>>>> df05599 (bomb BE progress)
=======
    PlaceFlames = "placeFlames",
    RemoveFlames = "removeFlames",
    ReplaceBlock = "replaceBlock",
    PlayerDamage = "playerDamage",
    ImmunityEnd = "immunityEnd",
>>>>>>> ee37177 (bob FE and BE kind of ready, needs merge with game end and few other details to handle)
}

