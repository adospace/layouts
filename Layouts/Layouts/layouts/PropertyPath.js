var layouts;
(function (layouts) {
    var PropertyPath = (function () {
        function PropertyPath(path, source) {
            this.pcHandlers = [];
            this.path = path;
            this.source = source;
            this.build();
            this.attachShource();
        }
        PropertyPath.prototype.attachShource = function () {
            this.source.subscribePropertyChanges(this.onPropertyChanged);
        };
        PropertyPath.prototype.detachSource = function () {
            this.source.unsubscribePropertyChanges(this.onPropertyChanged);
        };
        PropertyPath.prototype.build = function () {
            var oldNext = this.next;
            if (this.next != null) {
                this.next.detachSource();
                this.next.prev = null;
            }
            if (this.path == "" || this.path == ".") {
                this.name = ".";
                this.next = null;
            }
            else {
                var dotIndex = this.path.indexOf(".");
                if (dotIndex > -1) {
                    this.name = this.path.substring(0, dotIndex);
                    this.sourceProperty = layouts.DepObject.getProperty(this.source.typeName, this.name);
                    var sourcePropertyValue = this.source.getValue(this.sourceProperty);
                    if (sourcePropertyValue != null) {
                        var nextPath = this.path.substring(dotIndex + 1);
                        if (this.next != null && (this.next.path != nextPath || this.next.source != sourcePropertyValue))
                            this.next = new PropertyPath(this.path.substring(dotIndex + 1), sourcePropertyValue);
                        else
                            this.next.build();
                    }
                    else
                        this.next = null;
                }
                else {
                    this.name = this.path;
                    this.next = null;
                }
            }
            if (this.next != null) {
                this.next.attachShource();
                this.next.prev = this;
            }
            if (oldNext != this.next) {
                this.onPathChanged();
            }
        };
        PropertyPath.prototype.onPathChanged = function () {
            var _this = this;
            if (this.prev != null)
                this.prev.onPathChanged();
            else {
                this.pcHandlers.forEach(function (h) {
                    h(_this);
                });
            }
        };
        //subscribe to path change event
        PropertyPath.prototype.subscribePathChanges = function (handler) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        };
        //unsubscribe from path change event
        PropertyPath.prototype.unsubscribePathChanges = function (handler) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        };
        PropertyPath.prototype.getValue = function () {
            if (this.next != null)
                return this.next.getValue();
            else if (this.name == ".")
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: null };
            else if (this.name != null)
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: this.sourceProperty };
            else
                return { success: false };
        };
        PropertyPath.prototype.setValue = function (value) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null)
                this.source.setValue(this.sourceProperty, value);
        };
        PropertyPath.prototype.onPropertyChanged = function (depObject, property, value) {
            if (depObject == this.source && property.name == this.name) {
                this.build();
            }
        };
        return PropertyPath;
    })();
    layouts.PropertyPath = PropertyPath;
})(layouts || (layouts = {}));
//# sourceMappingURL=PropertyPath.js.map