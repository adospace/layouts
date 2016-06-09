var layouts;
(function (layouts) {
    var EventAction = (function () {
        function EventAction(invokeHandler) {
            this.invokeHandler = invokeHandler;
        }
        EventAction.prototype.invoke = function (parameter) {
            this.invokeHandler(this, parameter);
        };
        return EventAction;
    }());
    layouts.EventAction = EventAction;
})(layouts || (layouts = {}));
