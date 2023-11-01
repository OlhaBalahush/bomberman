import { Lobby } from "./Lobby";

export class LobbyTimer {
  private _timer: NodeJS.Timeout | null;

  constructor() {
    this._timer = null;
  }

  start(
    secondsToCount: number,
    //function to call when time left on counter changes
    lobby: Lobby,
    //function to call when timer runs out
    onComplete: () => void) {
    lobby.broadcastTimerChange(secondsToCount, secondsToCount)
    let remainingTime = secondsToCount - 1;
    this._timer = setInterval(() => {
      lobby.broadcastTimerChange(remainingTime, secondsToCount);
      if (remainingTime === 0) {
        clearInterval(this._timer!);
        this._timer = null;
        onComplete();
      }
      remainingTime--;
    }, 1000);
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  isActive(): boolean {
    return this._timer ? true : false;
  }
}