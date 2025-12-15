class timer {
  #time;
  #startTime;
  #timerState;
  #now;
  #count_requestAnimationFrame;
  constructor(timerMode = "up", defaultTime) {
    this.timerMode = timerMode;
    this.defaultTime = defaultTime;
    this.#startTime;
    this.#timerState = "stop";
    this.autoRestart = true;
    this.#count_requestAnimationFrame;
    this.#now = NaN;
  }
  #count() {
    const msTosec = (ms)=>ms/1000;
    const floorTo1Decimal = (num)=>Math.floor(num * 10) / 10;
    const now = performance.now();
    this.#now = now;
    if (!(this.#timerState == "stop")) {
      if (this.timerMode === "down" && this.#time <= 0) {
        if (this.#time < 0) {
          this.#time = 0;
        }
        if (this.countEvent) this.countEvent(this.#time);
        this.stop();
      } else {
        const deltaSecond = floorTo1Decimal(msTosec(now - this.#startTime));
        if (this.timerMode === "up") {
          const second = deltaSecond;
          this.#time = second;
        } else if (this.timerMode === "down") {
          const second = floorTo1Decimal(this.defaultTime - deltaSecond);
          this.#time = second;
        }
        if (this.countEvent) this.countEvent(this.#time);
        this.#count_requestAnimationFrame = requestAnimationFrame(this.#count.bind(this));
      }
    }
  }
  start() {
    if (this.defaultTime && this.timerMode == "down") {
      this.#time = this.defaultTime;
    } else {
      this.#time = 0;
    }
    this.#startTime = performance.now();
    this.#timerState = "running";
    if (this.startEvent) {
      this.startEvent();
    }
    this.#count_requestAnimationFrame = requestAnimationFrame(this.#count.bind(this));
  }
  stop() {
    if (this.#timerState == "stop") return;
    this.#timerState = "stop";
    cancelAnimationFrame(this.#count_requestAnimationFrame);
    if (this.stopEvent) {
      this.stopEvent(this.#time);
    }
    return this.#time;
  }
  reset() {
    this.#timerState = "stop";
    this.#time = (() => {
      if (this.defaultTime) {
        return this.defaultTime;
      } else {
        return 0;
      }
    })();
  }
  restart() {
    if (this.#timerState === "running") return;
    this.#timerState = "running";
    if (this.restartEvent) this.restartEvent(this.#time);
  }
  getTime() {
    return this.#time;
  }
  getTimerState(){
    return this.#timerState;
  }
}
