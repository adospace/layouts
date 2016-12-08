module layouts{
    export class Timer {

        constructor(public handler: (timer: Timer)=>void, public millisecond: number){
            if (handler == null)
                throw new Error("handler == null");
            if (millisecond <= 0)
                throw new Error("millisecond <= 0");
        }

        private timerId: number = -1;
        start() {
            this.stop();
            this.timerId = setTimeout(() => this.handler(this), this.millisecond);
        }

        stop() {
            if (this.timerId != -1) {
                clearTimeout(this.timerId);
                this.timerId = -1;
            }
        }

        
    }
} 