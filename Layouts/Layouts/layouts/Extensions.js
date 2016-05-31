var layouts;
(function (layouts) {
    var Ext = (function () {
        function Ext() {
        }
        Ext.hasProperty = function (obj, propertyName) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (propertyName in obj) || (propertyName in proto);
        };
        Ext.isString = function (obj) {
            return (typeof obj == "string" || obj instanceof String);
        };
        return Ext;
    })();
    layouts.Ext = Ext;
})(layouts || (layouts = {}));
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };
}
if (!String.prototype.toUpperFirstLetter) {
    String.prototype.toUpperFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}
if (!String.prototype.toLowerFirstLetter) {
    String.prototype.toLowerFirstLetter = function () {
        return this.charAt(0).toLowerCase() + this.slice(1);
    };
}
Number.prototype.isEpsilon = function () {
    return Math.abs(this) < 1e-10;
};
Number.prototype.isCloseTo = function (other) {
    if (!isFinite(other) && !isFinite(this))
        return true;
    return Math.abs(this - other) < 1e-10;
};
Number.prototype.minMax = function (min, max) {
    return Math.max(min, Math.min(this, max));
};
var InstanceLoader = (function () {
    function InstanceLoader(context) {
        this.context = context;
    }
    InstanceLoader.prototype.getInstance = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var tokens = name.split(".");
        var iterationObject = this.context[tokens[0]];
        if (iterationObject == null)
            return null;
        for (var i = 1; i < tokens.length; i++) {
            iterationObject = iterationObject[tokens[i]];
            if (iterationObject == null)
                return null;
        }
        var instance = Object.create(iterationObject.prototype);
        instance.constructor.apply(instance, args);
        return instance;
    };
    return InstanceLoader;
})();
