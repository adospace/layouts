var layouts;
(function (layouts) {
    var ObservableCollection = (function () {
        function ObservableCollection(elements) {
            this.pcHandlers = [];
            this.elements = elements == null ? new Array() : elements;
        }
        ObservableCollection.prototype.toArray = function () {
            return this.elements;
        };
        ObservableCollection.prototype.add = function (element) {
            var _this = this;
            if (element == null)
                throw new Error("element null");
            var iElement = this.elements.indexOf(element);
            if (iElement == -1) {
                this.elements.push(element);
                this.pcHandlers.slice(0).forEach(function (h) {
                    h.onCollectionChanged(_this, [element], [], 0);
                });
                return element;
            }
            return this.elements[iElement];
        };
        ObservableCollection.prototype.remove = function (element) {
            var _this = this;
            if (element == null)
                throw new Error("element null");
            var iElement = this.elements.indexOf(element);
            if (iElement != -1) {
                this.elements.splice(iElement, 1);
                this.pcHandlers.slice(0).forEach(function (h) {
                    h.onCollectionChanged(_this, [], [element], iElement);
                });
            }
        };
        ObservableCollection.prototype.at = function (index) {
            return this.elements[index];
        };
        ObservableCollection.prototype.first = function () {
            return this.elements[0];
        };
        ObservableCollection.prototype.last = function () {
            return this.elements[this.elements.length - 1];
        };
        Object.defineProperty(ObservableCollection.prototype, "count", {
            get: function () {
                return this.elements.length;
            },
            enumerable: true,
            configurable: true
        });
        ObservableCollection.prototype.forEach = function (action) {
            this.elements.forEach(action);
        };
        ObservableCollection.prototype.onChangeNotify = function (handler) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        };
        ObservableCollection.prototype.offChangeNotify = function (handler) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        };
        return ObservableCollection;
    }());
    layouts.ObservableCollection = ObservableCollection;
})(layouts || (layouts = {}));
