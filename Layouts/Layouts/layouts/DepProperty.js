var layouts;
(function (layouts) {
    var DepProperty = (function () {
        function DepProperty(name, defaultValue, options, converter) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (options === void 0) { options = null; }
            if (converter === void 0) { converter = null; }
            this._defaultValueMap = {};
            this.name = name;
            this._defaultValue = defaultValue;
            this.options = options;
            this.converter = converter;
        }
        DepProperty.prototype.overrideDefaultValue = function (typeName, defaultValue) {
            this._defaultValueMap[typeName] = defaultValue;
        };
        DepProperty.prototype.getDefaultValue = function (depObject) {
            var typeName = depObject["typeName"];
            if (typeName in this._defaultValueMap)
                return this._defaultValueMap[typeName];
            return this._defaultValue;
        };
        return DepProperty;
    })();
    layouts.DepProperty = DepProperty;
})(layouts || (layouts = {}));
