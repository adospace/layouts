var layouts;
(function (layouts) {
    var Timer = (function () {
        function Timer(handler, millisecond) {
            this.handler = handler;
            this.millisecond = millisecond;
            this.timerId = -1;
            if (handler == null)
                throw new Error("handler == null");
            if (millisecond <= 0)
                throw new Error("millisecond <= 0");
        }
        Timer.prototype.start = function () {
            var _this = this;
            this.stop();
            this.timerId = setTimeout(function () { return _this.handler(_this); }, this.millisecond);
        };
        Timer.prototype.stop = function () {
            if (this.timerId != -1) {
                clearTimeout(this.timerId);
                this.timerId = -1;
            }
        };
        return Timer;
    })();
    layouts.Timer = Timer;
})(layouts || (layouts = {}));
