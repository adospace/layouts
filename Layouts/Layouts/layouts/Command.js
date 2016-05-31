var layouts;
(function (layouts) {
    var Command = (function () {
        function Command(executeHandler, canExecuteHandler) {
            this.handlers = [];
            this.executeHandler = executeHandler;
            this.canExecuteHandler = canExecuteHandler;
        }
        Command.prototype.canExecute = function (parameter) {
            if (this.canExecuteHandler != null)
                return this.canExecuteHandler(this, parameter);
            return true;
        };
        Command.prototype.execute = function (parameter) {
            if (this.canExecute(parameter))
                this.executeHandler(this, parameter);
        };
        Command.prototype.onCanExecuteChangeNotify = function (handler) {
            if (this.handlers.indexOf(handler) == -1)
                this.handlers.push(handler);
        };
        Command.prototype.offCanExecuteChangeNotify = function (handler) {
            var index = this.handlers.indexOf(handler, 0);
            if (index != -1) {
                this.handlers.splice(index, 1);
            }
        };
        Command.prototype.canExecuteChanged = function () {
            var _this = this;
            this.handlers.slice(0).forEach(function (h) {
                h.onCommandCanExecuteChanged(_this);
            });
        };
        return Command;
    })();
    layouts.Command = Command;
})(layouts || (layouts = {}));
