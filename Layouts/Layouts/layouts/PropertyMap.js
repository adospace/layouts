var layouts;
(function (layouts) {
    var PropertyMap = (function () {
        function PropertyMap() {
            this.propertyMap = {};
        }
        PropertyMap.prototype.getProperty = function (name) {
            return this.propertyMap[name];
        };
        PropertyMap.prototype.all = function () {
            var _this = this;
            var keys = Object.keys(this.propertyMap);
            return keys.map(function (v) { return _this.propertyMap[v]; });
        };
        PropertyMap.prototype.register = function (name, property) {
            if (this.propertyMap[name] != null)
                throw new Error("property already registered");
            this.propertyMap[name] = property;
        };
        return PropertyMap;
    }());
    layouts.PropertyMap = PropertyMap;
})(layouts || (layouts = {}));
