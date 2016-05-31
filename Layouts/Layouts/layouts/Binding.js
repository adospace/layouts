var layouts;
(function (layouts) {
    var Binding = (function () {
        function Binding(target, targetProperty, path, twoWay) {
            if (twoWay === void 0) { twoWay = false; }
            this.twoWay = false;
            this.target = target;
            this.targetProperty = targetProperty;
            this.path = path;
            this.twoWay = twoWay;
            this.path.subscribePathChanges(this.onPathChanged);
            this.updateTarget();
        }
        Binding.prototype.onPathChanged = function (path) {
            this.updateTarget();
        };
        Binding.prototype.updateTarget = function () {
            if (this.source != null)
                this.source.unsubscribePropertyChanges(this.onSourcePropertyChanged);
            var retValue = this.path.getValue();
            if (retValue.success) {
                this.source = retValue.source;
                this.sourceProperty = retValue.sourceProperty;
                this.target.setValue(this.targetProperty, retValue.value); //update target
            }
            if (this.source != null)
                this.source.subscribePropertyChanges(this.onSourcePropertyChanged);
        };
        Binding.prototype.onSourcePropertyChanged = function (depObject, property, value) {
            if (property == this.sourceProperty) {
                var retValue = this.path.getValue();
                if (retValue.success) {
                    this.target.setValue(this.targetProperty, retValue.value); //update target
                }
            }
        };
        return Binding;
    })();
    layouts.Binding = Binding;
})(layouts || (layouts = {}));
//# sourceMappingURL=Binding.js.map