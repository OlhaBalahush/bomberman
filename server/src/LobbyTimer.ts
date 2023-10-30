export class LobbyTimer {
  private _timer: NodeJS.Timeout | null;

  constructor() {
    this._timer = null;
  }

  start(
    secondsToCount: number,
    //function to call when time left on counter changes
    onCountDown: (remainingTime: number, timerType: number) => void,
    //function to call when timer runs out
    onComplete: () => void) {
    let remainingTime = secondsToCount;
    onCountDown(remainingTime, secondsToCount)

    this._timer = setInterval(() => {
      onCountDown(remainingTime, secondsToCount);
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

}