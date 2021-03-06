var layouts;
(function (layouts) {
    var Ext = (function () {
        function Ext() {
        }
        Ext.hasProperty = function (obj, propertyName) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            if (proto == "")
                return;
            return (propertyName in obj) || (propertyName in proto);
        };
        Ext.isString = function (obj) {
            return (typeof obj == "string" || obj instanceof String);
        };
        return Ext;
    }());
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
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (other) {
        return this.lastIndexOf(other, 0) == 0;
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
Number.prototype.isLessThen = function (other) {
    return (this - other) < 1e-10;
};
Number.prototype.isGreaterThen = function (other) {
    return (this - other) > 1e-10;
};
if (!Array.prototype.firstOrDefault) {
    Array.prototype.firstOrDefault = function (callback, defaultValue) {
        var arrayOfItems = this;
        for (var i = 0; i < arrayOfItems.length; ++i) {
            var item = arrayOfItems[i];
            if (callback(item, i))
                return item;
        }
        return defaultValue;
    };
}
if (!NodeList.prototype.firstOrDefault) {
    NodeList.prototype.firstOrDefault = function (callback, defaultValue) {
        var nodeList = this;
        for (var i = 0; i < nodeList.length; ++i) {
            var item = nodeList[i];
            if (callback(item, i))
                return item;
        }
        return defaultValue;
    };
}
if (!NodeList.prototype.where) {
    NodeList.prototype.where = function (callback) {
        var nodeList = this;
        var res = new Array();
        for (var i = 0; i < nodeList.length; ++i) {
            var item = nodeList[i];
            if (callback(item, i))
                res.push(item);
        }
        return res;
    };
}
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
}());
