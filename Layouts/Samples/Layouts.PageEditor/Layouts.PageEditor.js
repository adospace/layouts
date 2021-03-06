var layouts;
(function (layouts) {
    var Animate = (function () {
        function Animate(easeFunction, duration) {
            this.easeFunction = easeFunction;
        }
        return Animate;
    }());
    layouts.Animate = Animate;
})(layouts || (layouts = {}));
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
var layouts;
(function (layouts) {
    var DepProperty = (function () {
        function DepProperty(name, typeName, defaultValue, options, converter) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (options === void 0) { options = null; }
            if (converter === void 0) { converter = null; }
            this.name = name;
            this.typeName = typeName;
            this.options = options;
            this.converter = converter;
            this._defaultValueMap = {};
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
    }());
    layouts.DepProperty = DepProperty;
})(layouts || (layouts = {}));
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
var layouts;
(function (layouts) {
    var Consts = (function () {
        function Consts() {
        }
        return Consts;
    }());
    Consts.stringEmpty = "";
    layouts.Consts = Consts;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var ConverterContext = (function () {
        function ConverterContext(source, sourceProperty, target, targetProperty, parameter) {
            this.source = source;
            this.sourceProperty = sourceProperty;
            this.target = target;
            this.targetProperty = targetProperty;
            this.parameter = parameter;
        }
        return ConverterContext;
    }());
    layouts.ConverterContext = ConverterContext;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var DepObject = (function () {
        function DepObject() {
            this.localPropertyValueMap = {};
            this.dpcHandlers = [];
            this.pcHandlers = [];
            this.bindings = new Array();
        }
        DepObject.registerProperty = function (typeName, name, defaultValue, options, converter) {
            if (DepObject.globalPropertyMap[typeName] == null)
                DepObject.globalPropertyMap[typeName] = new layouts.PropertyMap();
            var newProperty = new layouts.DepProperty(name, typeName, defaultValue, options, converter);
            DepObject.globalPropertyMap[typeName].register(name, newProperty);
            return newProperty;
        };
        DepObject.getProperty = function (typeName, name) {
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;
            return DepObject.globalPropertyMap[typeName].getProperty(name);
        };
        DepObject.getProperties = function (typeName) {
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;
            return DepObject.globalPropertyMap[typeName].all();
        };
        DepObject.forAllProperties = function (obj, callback) {
            if (obj == null)
                throw new Error("obj == null");
            var typeName = obj["typeName"];
            if (DepObject.globalPropertyMap[typeName] == null)
                return;
            DepObject.getProperties(typeName).forEach(function (_) { return callback(_); });
            if (DepObject.globalPropertyMap[typeName] == null)
                return;
            if (obj["__proto__"] != null)
                DepObject.forAllProperties(obj["__proto__"], callback);
        };
        DepObject.lookupProperty = function (obj, name) {
            if (obj == null)
                throw new Error("obj == null");
            var typeName = obj["typeName"];
            var property = DepObject.globalPropertyMap[typeName] == null ? null : DepObject.globalPropertyMap[typeName].getProperty(name);
            if (property == null && obj["__proto__"] != null)
                return DepObject.lookupProperty(obj["__proto__"], name);
            return property;
        };
        DepObject.prototype.getValue = function (property) {
            if (property.name in this.localPropertyValueMap) {
                return this.localPropertyValueMap[property.name];
            }
            return property.getDefaultValue(this);
        };
        DepObject.prototype.setValue = function (property, value) {
            var oldValue = this.getValue(property);
            var valueToSet = property.converter != null && layouts.Ext.isString(value) ? property.converter(value) : value;
            if (oldValue != valueToSet) {
                this.localPropertyValueMap[property.name] = valueToSet;
                this.onDependencyPropertyChanged(property, valueToSet, oldValue);
            }
        };
        DepObject.prototype.resetValue = function (property) {
            if (property.name in this.localPropertyValueMap) {
                var oldValue = this.getValue(property);
                delete this.localPropertyValueMap[property.name];
                this.onDependencyPropertyChanged(property, null, oldValue);
            }
        };
        DepObject.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
            var _this = this;
            this.dpcHandlers.forEach(function (h) {
                h.onDependencyPropertyChanged(_this, property);
            });
        };
        DepObject.prototype.subscribeDependencyPropertyChanges = function (observer) {
            if (this.dpcHandlers.indexOf(observer) == -1)
                this.dpcHandlers.push(observer);
        };
        DepObject.prototype.unsubscribeDependencyPropertyChanges = function (observer) {
            var index = this.dpcHandlers.indexOf(observer, 0);
            if (index != -1) {
                this.dpcHandlers.splice(index, 1);
            }
        };
        DepObject.prototype.onPropertyChanged = function (propertyName, value, oldValue) {
            var _this = this;
            this.pcHandlers.forEach(function (h) {
                h.onChangeProperty(_this, propertyName, value);
            });
        };
        DepObject.prototype.subscribePropertyChanges = function (observer) {
            if (this.pcHandlers.indexOf(observer) == -1)
                this.pcHandlers.push(observer);
        };
        DepObject.prototype.unsubscribePropertyChanges = function (observer) {
            var index = this.pcHandlers.indexOf(observer, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        };
        DepObject.prototype.bind = function (property, propertyPath, twoway, source, converter, converterParameter, format) {
            var newBinding = new Binding(this, property, propertyPath, source, twoway, converter, converterParameter, format);
            this.bindings.push(newBinding);
        };
        return DepObject;
    }());
    DepObject.globalPropertyMap = {};
    DepObject.logBindingTraceToConsole = false;
    layouts.DepObject = DepObject;
    var Binding = (function () {
        function Binding(target, targetProperty, propertyPath, source, twoWay, converter, converterParameter, format) {
            if (twoWay === void 0) { twoWay = false; }
            if (converter === void 0) { converter = null; }
            if (converterParameter === void 0) { converterParameter = null; }
            if (format === void 0) { format = null; }
            this.twoWay = false;
            this.converter = null;
            this.converterParameter = null;
            this.format = null;
            this.target = target;
            this.targetProperty = targetProperty;
            this.path = new PropertyPath(this, propertyPath, source);
            this.twoWay = twoWay;
            this.converter = converter;
            this.converterParameter = converterParameter;
            this.format = format;
            this.updateTarget();
            if (this.twoWay)
                this.target.subscribeDependencyPropertyChanges(this);
        }
        Binding.prototype.updateTarget = function () {
            var retValue = this.path.getValue();
            if (retValue.success) {
                this.source = retValue.source;
                this.sourceProperty = retValue.sourceProperty;
                var valueToSet = this.converter != null ? this.converter.convert(retValue.value, {
                    source: this.source,
                    sourceProperty: this.sourceProperty,
                    target: this.target,
                    targetProperty: this.targetProperty,
                    parameter: this.converterParameter
                }) : retValue.value;
                this.target.setValue(this.targetProperty, this.format != null ? this.format.format(valueToSet) : valueToSet);
            }
            else if (this.source != null) {
                this.target.resetValue(this.targetProperty);
                this.source = null;
                this.sourceProperty = null;
            }
        };
        Binding.prototype.onDependencyPropertyChanged = function (depObject, depProperty) {
            if (depObject == this.target &&
                depProperty == this.targetProperty &&
                this.twoWay) {
                var value = depObject.getValue(depProperty);
                this.path.setValue(this.converter != null ? this.converter.convertBack(value, {
                    source: this.source,
                    sourceProperty: this.sourceProperty,
                    target: this.target,
                    targetProperty: this.targetProperty,
                    parameter: this.converterParameter
                }) : value);
            }
        };
        return Binding;
    }());
    var PropertyPath = (function () {
        function PropertyPath(owner, path, source) {
            this.owner = owner;
            this.path = path;
            this.source = source;
            this.build();
            this.attachShource();
        }
        PropertyPath.prototype.attachShource = function () {
            if (this.sourceProperty == null) {
                if (this.source.subscribePropertyChanges != null)
                    this.source.subscribePropertyChanges(this);
            }
            else if (this.source["unsubscribeDependencyPropertyChanges"] != null)
                this.source.subscribeDependencyPropertyChanges(this);
        };
        PropertyPath.prototype.detachSource = function () {
            if (this.source.unsubscribePropertyChanges != null)
                this.source.unsubscribePropertyChanges(this);
            if (this.source["unsubscribeDependencyPropertyChanges"] != null)
                this.source.unsubscribeDependencyPropertyChanges(this);
        };
        PropertyPath.prototype.lookForIndexers = function () {
            var re = /([\w_]+)(\[([\w_]+)\])/gmi;
            var m;
            var nameStr = this.name;
            if ((m = re.exec(nameStr)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                this.name = m[1];
                this.indexers = [];
                this.indexers.push(m[3]);
                re = /([\w_]+)(\[([\w_]+)\])(\[([\w_]+)\])/gmi;
                if ((m = re.exec(nameStr)) !== null) {
                    if (m.index === re.lastIndex) {
                        re.lastIndex++;
                    }
                    this.indexers.push(m[5]);
                }
            }
            else
                this.indexers = null;
        };
        PropertyPath.prototype.build = function () {
            var oldNext = this.next;
            if (this.next != null) {
                this.next.detachSource();
                this.next.prev = null;
            }
            if (this.path == layouts.Consts.stringEmpty ||
                this.path == ".") {
                this.name = ".";
                this.next = null;
            }
            else {
                var dotIndex = this.path.indexOf(".");
                if (dotIndex > -1) {
                    this.name = this.path.substring(0, dotIndex);
                    this.lookForIndexers();
                    this.sourceProperty = DepObject.lookupProperty(this.source, this.name);
                    var sourcePropertyValue = (this.sourceProperty != null) ?
                        this.source.getValue(this.sourceProperty) :
                        this.source[this.name];
                    if (this.indexers != null && sourcePropertyValue != null) {
                        sourcePropertyValue = sourcePropertyValue[this.indexers[0]];
                        if (this.indexers.length > 1 && sourcePropertyValue != null)
                            sourcePropertyValue = sourcePropertyValue[this.indexers[1]];
                    }
                    if (sourcePropertyValue != null) {
                        var nextPath = this.path.substring(dotIndex + 1);
                        if (this.next == null ||
                            this.next.path != nextPath ||
                            this.next.source != sourcePropertyValue)
                            this.next = new PropertyPath(this.owner, this.path.substring(dotIndex + 1), sourcePropertyValue);
                        else if (this.next != null)
                            this.next.build();
                    }
                    else {
                        this.next = null;
                    }
                }
                else {
                    this.name = this.path;
                    this.lookForIndexers();
                    this.sourceProperty = DepObject.lookupProperty(this.source, this.name);
                    this.next = null;
                }
            }
            if (this.next != null) {
                this.next.attachShource();
                this.next.prev = this;
            }
            if (this.next != oldNext)
                this.onPathChanged();
        };
        PropertyPath.prototype.onPathChanged = function () {
            if (this.prev != null)
                this.prev.onPathChanged();
            else {
                this.owner.updateTarget();
            }
        };
        PropertyPath.prototype.getValue = function () {
            if (this.next != null)
                return this.next.getValue();
            else if (this.name == ".")
                return {
                    success: true,
                    value: this.source,
                    source: this.source,
                    property: null
                };
            else if (this.name != null && this.path.indexOf(".") == -1) {
                if (DepObject.logBindingTraceToConsole)
                    if (this.sourceProperty == null && (!(this.name in this.source)))
                        console.log("[Bindings] Unable to find property '{0}' on type '{1}'".format(this.name, this.source["typeName"] == null ? "<noneType>" : this.source["typeName"]));
                var sourcePropertyValue = (this.sourceProperty != null) ?
                    this.source.getValue(this.sourceProperty) :
                    this.source[this.name];
                if (this.indexers != null && sourcePropertyValue != null) {
                    sourcePropertyValue = sourcePropertyValue[this.indexers[0]];
                    if (this.indexers.length > 1 && sourcePropertyValue != null)
                        sourcePropertyValue = sourcePropertyValue[this.indexers[1]];
                }
                return {
                    success: true,
                    value: sourcePropertyValue,
                    source: this.source,
                    property: this.sourceProperty
                };
            }
            else
                return {
                    success: false
                };
        };
        PropertyPath.prototype.setValue = function (value) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null && this.path.indexOf(".") == -1) {
                if (this.indexers != null)
                    throw new Error("Unable to update source when indexers are specified in binding path");
                if (this.sourceProperty != null)
                    this.source.setValue(this.sourceProperty, value);
                else
                    this.source[this.name] = value;
            }
        };
        PropertyPath.prototype.onDependencyPropertyChanged = function (depObject, depProperty) {
            if (depObject == this.source &&
                depProperty.name == this.name) {
                this.build();
                this.owner.updateTarget();
            }
        };
        PropertyPath.prototype.onChangeProperty = function (source, propertyName, value) {
            if (source == this.source &&
                propertyName == this.name) {
                this.build();
                this.owner.updateTarget();
            }
        };
        return PropertyPath;
    }());
})(layouts || (layouts = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var layouts;
(function (layouts) {
    var Size = (function () {
        function Size(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.width = width;
            this.height = height;
        }
        Size.prototype.toRect = function () {
            return new Rect(0, 0, this.width, this.height);
        };
        return Size;
    }());
    layouts.Size = Size;
    var Rect = (function () {
        function Rect(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Object.defineProperty(Rect.prototype, "size", {
            get: function () {
                return new Size(this.width, this.height);
            },
            enumerable: true,
            configurable: true
        });
        return Rect;
    }());
    layouts.Rect = Rect;
    var Vector = (function () {
        function Vector(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Vector.prototype, "isEmpty", {
            get: function () {
                return this.x == 0 && this.x == 0;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.add = function (other) {
            return new Vector(this.x + other.x, this.y + other.y);
        };
        return Vector;
    }());
    layouts.Vector = Vector;
    var FrameworkPropertyMetadataOptions;
    (function (FrameworkPropertyMetadataOptions) {
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["None"] = 0] = "None";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsMeasure"] = 1] = "AffectsMeasure";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsArrange"] = 2] = "AffectsArrange";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsParentMeasure"] = 4] = "AffectsParentMeasure";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsParentArrange"] = 8] = "AffectsParentArrange";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsRender"] = 16] = "AffectsRender";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["Inherits"] = 32] = "Inherits";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["OverridesInheritanceBehavior"] = 64] = "OverridesInheritanceBehavior";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["NotDataBindable"] = 128] = "NotDataBindable";
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["BindsTwoWayByDefault"] = 256] = "BindsTwoWayByDefault";
    })(FrameworkPropertyMetadataOptions = layouts.FrameworkPropertyMetadataOptions || (layouts.FrameworkPropertyMetadataOptions = {}));
    var ExtendedProperty = (function () {
        function ExtendedProperty(name, value) {
            this.name = name;
            this.value = value;
        }
        return ExtendedProperty;
    }());
    layouts.ExtendedProperty = ExtendedProperty;
    var UIElement = (function (_super) {
        __extends(UIElement, _super);
        function UIElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.relativeOffset = null;
            _this.measureDirty = true;
            _this.arrangeDirty = true;
            _this.layoutInvalid = true;
            _this._extendedProperties = [];
            return _this;
        }
        Object.defineProperty(UIElement.prototype, "typeName", {
            get: function () {
                return UIElement.typeName;
            },
            enumerable: true,
            configurable: true
        });
        UIElement.prototype.measure = function (availableSize) {
            if (!this.isVisible) {
                this.desiredSize = new Size();
                this.measureDirty = false;
                return;
            }
            var isCloseToPreviousMeasure = this.previousAvailableSize == null ? false : availableSize.width.isCloseTo(this.previousAvailableSize.width) &&
                availableSize.height.isCloseTo(this.previousAvailableSize.height);
            if (!this.measureDirty && isCloseToPreviousMeasure)
                return;
            this.previousAvailableSize = availableSize;
            var desiredSize = this.measureCore(availableSize);
            if (isNaN(desiredSize.width) ||
                !isFinite(desiredSize.width) ||
                isNaN(desiredSize.height) ||
                !isFinite(desiredSize.height))
                throw new Error("measure pass must return valid size");
            this.desiredSize = this.animateSize(desiredSize);
            this.measureDirty = false;
        };
        UIElement.prototype.measureCore = function (availableSize) {
            return new Size();
        };
        UIElement.prototype.arrange = function (finalRect) {
            if (this.measureDirty)
                this.measure(finalRect.size);
            if (!this.isVisible)
                return;
            var isCloseToPreviousArrange = this.previousFinalRect == null ? false :
                finalRect.x.isCloseTo(this.previousFinalRect.x) &&
                    finalRect.y.isCloseTo(this.previousFinalRect.y) &&
                    finalRect.width.isCloseTo(this.previousFinalRect.width) &&
                    finalRect.height.isCloseTo(this.previousFinalRect.height);
            if (!this.arrangeDirty && isCloseToPreviousArrange)
                return;
            this.layoutInvalid = true;
            this.previousFinalRect = finalRect;
            this.arrangeCore(finalRect);
            this.finalRect = finalRect;
            this.arrangeDirty = false;
        };
        UIElement.prototype.arrangeCore = function (finalRect) {
            this.renderSize = finalRect.size;
        };
        UIElement.prototype.layout = function (relativeOffset) {
            if (relativeOffset === void 0) { relativeOffset = null; }
            if (this.layoutInvalid) {
                this.relativeOffset = relativeOffset;
                this.layoutOverride();
                if (this._visual != null &&
                    this.isVisible)
                    this._visual.style.visibility = "";
                this.layoutInvalid = false;
                var layoutUpdated = this.layoutUpdated;
                if (layoutUpdated != null)
                    layoutUpdated.invoke(this);
            }
        };
        UIElement.prototype.layoutOverride = function () {
            if (this._visual != null) {
                if (this.relativeOffset != null) {
                    this._visual.style.marginTop = this.relativeOffset.y.toString() + "px";
                    this._visual.style.marginLeft = this.relativeOffset.x.toString() + "px";
                }
            }
        };
        UIElement.prototype.animateSize = function (desiredSize) {
            return desiredSize;
        };
        UIElement.prototype.attachVisual = function (elementContainer, showImmediately) {
            if (showImmediately === void 0) { showImmediately = false; }
            if (this._visual == null &&
                elementContainer != null)
                this.attachVisualOverride(elementContainer);
            if (this._visual == null &&
                elementContainer == null)
                this.attachVisualOverride(null);
            if (this._visual == null)
                return null;
            if (elementContainer != this._visual.parentElement) {
                if (this._visual.parentElement != null) {
                    var parentElement = this._visual.parentElement;
                    parentElement.removeChild(this._visual);
                    this.visualDisconnected(parentElement);
                }
                if (elementContainer != null) {
                    if (!showImmediately)
                        this._visual.style.visibility = "hidden";
                    this.invalidateMeasure();
                    elementContainer.appendChild(this._visual);
                    if (elementContainer != null)
                        this.visualConnected(elementContainer);
                }
            }
            return this._visual;
        };
        Object.defineProperty(UIElement.prototype, "visual", {
            get: function () {
                return this._visual;
            },
            enumerable: true,
            configurable: true
        });
        UIElement.prototype.attachVisualOverride = function (elementContainer) {
            var _this = this;
            if (this._visual == null)
                return;
            this._extendedProperties.forEach(function (ep) {
                if (ep.name in _this._visual)
                    _this._visual[ep.name] = ep.value;
                else
                    _this._visual.style[ep.name] = ep.value;
            });
            this._visual.style.visibility = this.isVisible ? "" : "hidden";
            if (this.command != null)
                this._visual.onmousedown = function (ev) { return _this.onMouseDown(ev); };
            if (this.popup != null)
                this._visual.onmouseup = function (ev) { return _this.onMouseUp(ev); };
            var name = this.id;
            if (this._visual.id != name &&
                name != null)
                this._visual.id = name;
            var className = this.cssClass;
            if (this._visual.className != className &&
                className != null) {
                this._visual.className = className;
            }
            this._visual.style.position = "absolute";
        };
        UIElement.prototype.onMouseDown = function (ev) {
            var command = this.command;
            var commandParameter = this.commandParameter;
            if (command != null && command.canExecute(commandParameter)) {
                command.execute(commandParameter);
                this.onCommandCanExecuteChanged(command);
                ev.stopPropagation();
            }
        };
        UIElement.prototype.onMouseUp = function (ev) {
            var popup = this.popup;
            if (popup != null) {
                layouts.LayoutManager.showPopup(popup);
                ev.stopPropagation();
                if (this.autoClosePopup) {
                    document.addEventListener("mouseup", function () {
                        this.removeEventListener("mouseup", arguments.callee);
                        layouts.LayoutManager.closePopup(popup);
                    });
                }
            }
        };
        UIElement.prototype.getBoundingClientRect = function () {
            if (this._visual == null)
                throw new Error("Unable to get bounding rect for element not linked to DOM");
            return this._visual.getBoundingClientRect();
        };
        UIElement.prototype.visualConnected = function (elementContainer) {
            this.parentVisualConnected(this, elementContainer);
        };
        UIElement.prototype.parentVisualConnected = function (parent, elementContainer) {
            if (this._logicalChildren == null)
                return;
            this._logicalChildren.forEach(function (c) { return c.parentVisualConnected(parent, elementContainer); });
        };
        UIElement.prototype.visualDisconnected = function (elementContainer) {
            this.parentVisualDisconnected(this, elementContainer);
        };
        UIElement.prototype.parentVisualDisconnected = function (parent, elementContainer) {
            if (this._logicalChildren == null)
                return;
            this._logicalChildren.forEach(function (c) { return c.parentVisualDisconnected(parent, elementContainer); });
        };
        UIElement.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
            var _this = this;
            if (property == UIElement.commandProperty) {
                if (oldValue != null) {
                    oldValue.offCanExecuteChangeNotify(this);
                    if (this._visual != null)
                        this._visual.onmousedown = null;
                }
                if (value != null) {
                    value.onCanExecuteChangeNotify(this);
                    if (this._visual != null)
                        this._visual.onmousedown = function (ev) { return _this.onMouseDown(ev); };
                }
            }
            else if (property == UIElement.popupProperty) {
                if (oldValue != null) {
                    if (this._visual != null)
                        this._visual.onmouseup = null;
                    if (oldValue.parent == this)
                        oldValue.parent = null;
                }
                if (value != null) {
                    if (this._visual != null)
                        this._visual.onmouseup = function (ev) { return _this.onMouseUp(ev); };
                    value.parent = this;
                }
            }
            else if (property == UIElement.isVisibleProperty) {
                if (this._visual != null)
                    this._visual.style.visibility = value ? "" : "hidden";
            }
            else if (property == UIElement.classProperty) {
                var className = this.cssClass;
                if (this._visual != null && this._visual.className != className &&
                    className != null) {
                    this._visual.className = className;
                }
            }
            var options = property.options;
            if ((options & FrameworkPropertyMetadataOptions.AffectsMeasure) != 0)
                this.invalidateMeasure();
            if ((options & FrameworkPropertyMetadataOptions.AffectsArrange) != 0)
                this.invalidateArrange();
            if ((options & FrameworkPropertyMetadataOptions.AffectsParentMeasure) != 0 && this._parent != null)
                this._parent.invalidateMeasure();
            if ((options & FrameworkPropertyMetadataOptions.AffectsParentArrange) != 0 && this._parent != null)
                this._parent.invalidateArrange();
            if ((options & FrameworkPropertyMetadataOptions.AffectsRender) != 0)
                this.invalidateLayout();
            if ((options & FrameworkPropertyMetadataOptions.Inherits) != 0 && this._logicalChildren != null)
                this._logicalChildren.forEach(function (child) { return child.onDependencyPropertyChanged(property, value, oldValue); });
            _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
        };
        UIElement.prototype.onCommandCanExecuteChanged = function (command) {
        };
        UIElement.prototype.getValue = function (property) {
            if (!(property.name in this.localPropertyValueMap)) {
                var options = property.options;
                if (options != null &&
                    this._parent != null &&
                    (options & FrameworkPropertyMetadataOptions.Inherits) != 0) {
                    return this._parent.getValue(property);
                }
                return property.getDefaultValue(this);
            }
            return this.localPropertyValueMap[property.name];
        };
        UIElement.prototype.invalidateMeasure = function () {
            this.arrangeDirty = true;
            this.layoutInvalid = true;
            if (!this.measureDirty) {
                this.measureDirty = true;
                if (this._parent != null)
                    this._parent.invalidateMeasure();
            }
        };
        UIElement.prototype.invalidateArrange = function () {
            this.layoutInvalid = true;
            if (!this.arrangeDirty) {
                this.arrangeDirty = true;
                if (this._parent != null)
                    this._parent.invalidateArrange();
            }
        };
        UIElement.prototype.invalidateLayout = function () {
            if (!this.layoutInvalid) {
                this.layoutInvalid = true;
                if (this._parent != null)
                    this._parent.invalidateLayout();
            }
        };
        UIElement.prototype.findElementByName = function (name) {
            if (name == this.id)
                return this;
            if (this._logicalChildren != null) {
                for (var i = 0; i < this._logicalChildren.length; i++) {
                    var child = this._logicalChildren[i];
                    var foundElement = child.findElementByName(name);
                    if (foundElement != null)
                        return foundElement;
                }
            }
            return null;
        };
        UIElement.prototype.forAllChildrenOfType = function (elementType, action) {
            var typeName = elementType["typeName"];
            if (this._logicalChildren != null) {
                for (var i = 0; i < this._logicalChildren.length; i++) {
                    var child = this._logicalChildren[i];
                    if (child.typeName == typeName) {
                        if (!action(child))
                            return false;
                    }
                    if (!child.forAllChildrenOfType(elementType, action))
                        return false;
                }
            }
            return true;
        };
        Object.defineProperty(UIElement.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (newParent) {
                if (this._parent != newParent) {
                    var oldParent = this._parent;
                    if (oldParent != null) {
                        var indexOfElement = oldParent._logicalChildren.indexOf(this);
                        oldParent._logicalChildren.splice(indexOfElement, 1);
                    }
                    this._parent = newParent;
                    if (newParent != null) {
                        if (newParent._logicalChildren == null)
                            newParent._logicalChildren = new Array();
                        newParent._logicalChildren.push(this);
                        if (this.measureDirty)
                            this._parent.invalidateMeasure();
                    }
                    this.notifyInheritsPropertiesChange();
                    this.onParentChanged(oldParent, newParent);
                }
            },
            enumerable: true,
            configurable: true
        });
        UIElement.prototype.notifyInheritsPropertiesChange = function () {
            for (var propertyName in this.localPropertyValueMap) {
                var property = layouts.DepObject.lookupProperty(this, propertyName);
                var options = property == null ? null : property.options;
                if (options != null &&
                    (options & FrameworkPropertyMetadataOptions.Inherits) != 0) {
                    this.onParentDependencyPropertyChanged(property);
                }
            }
            if (this._parent != null)
                this._parent.notifyInheritsPropertiesChange();
        };
        UIElement.prototype.onParentDependencyPropertyChanged = function (property) {
            if (this._logicalChildren != null) {
                this._logicalChildren.forEach(function (child) { return child.onParentDependencyPropertyChanged(property); });
            }
            _super.prototype.onDependencyPropertyChanged.call(this, property, null, null);
        };
        UIElement.prototype.onParentChanged = function (oldParent, newParent) {
        };
        UIElement.prototype.addExtentedProperty = function (name, value) {
            this._extendedProperties.push(new ExtendedProperty(name, value));
        };
        Object.defineProperty(UIElement.prototype, "isVisible", {
            get: function () {
                return this.getValue(UIElement.isVisibleProperty);
            },
            set: function (value) {
                this.setValue(UIElement.isVisibleProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "cssClass", {
            get: function () {
                return this.getValue(UIElement.classProperty);
            },
            set: function (value) {
                this.setValue(UIElement.classProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "id", {
            get: function () {
                return this.getValue(UIElement.idProperty);
            },
            set: function (value) {
                this.setValue(UIElement.idProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "command", {
            get: function () {
                return this.getValue(UIElement.commandProperty);
            },
            set: function (value) {
                this.setValue(UIElement.commandProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "commandParameter", {
            get: function () {
                return this.getValue(UIElement.commandParameterProperty);
            },
            set: function (value) {
                this.setValue(UIElement.commandParameterProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "popup", {
            get: function () {
                return this.getValue(UIElement.popupProperty);
            },
            set: function (value) {
                this.setValue(UIElement.popupProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "autoClosePopup", {
            get: function () {
                return this.getValue(UIElement.autoClosePopupProperty);
            },
            set: function (value) {
                this.setValue(UIElement.autoClosePopupProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "layoutUpdated", {
            get: function () {
                return this.getValue(UIElement.layoutUpdatedProperty);
            },
            set: function (value) {
                this.setValue(UIElement.layoutUpdatedProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        return UIElement;
    }(layouts.DepObject));
    UIElement.typeName = "layouts.UIElement";
    UIElement.isVisibleProperty = layouts.DepObject.registerProperty(UIElement.typeName, "IsVisible", true, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsParentMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
    UIElement.classProperty = layouts.DepObject.registerProperty(UIElement.typeName, "class", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
    UIElement.idProperty = layouts.DepObject.registerProperty(UIElement.typeName, "id", layouts.Consts.stringEmpty, FrameworkPropertyMetadataOptions.AffectsRender);
    UIElement.commandProperty = layouts.DepObject.registerProperty(UIElement.typeName, "Command", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
    UIElement.commandParameterProperty = layouts.DepObject.registerProperty(UIElement.typeName, "CommandParameter", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
    UIElement.popupProperty = layouts.DepObject.registerProperty(UIElement.typeName, "Popup", null, FrameworkPropertyMetadataOptions.None);
    UIElement.autoClosePopupProperty = layouts.DepObject.registerProperty(UIElement.typeName, "AutoClosePopup", true, FrameworkPropertyMetadataOptions.None, function (value) {
        if (value == null || (value.toLowerCase() != "true" && value.toLowerCase() != "false"))
            throw new Error("Unable to valuate string '{0}' as boolean".format(value));
        return value.toLowerCase() == "true" ? true : false;
    });
    UIElement.layoutUpdatedProperty = layouts.DepObject.registerProperty(UIElement.typeName, "LayoutUpdated", null, FrameworkPropertyMetadataOptions.None);
    layouts.UIElement = UIElement;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var VerticalAlignment;
    (function (VerticalAlignment) {
        VerticalAlignment[VerticalAlignment["Top"] = 0] = "Top";
        VerticalAlignment[VerticalAlignment["Center"] = 1] = "Center";
        VerticalAlignment[VerticalAlignment["Bottom"] = 2] = "Bottom";
        VerticalAlignment[VerticalAlignment["Stretch"] = 3] = "Stretch";
    })(VerticalAlignment = layouts.VerticalAlignment || (layouts.VerticalAlignment = {}));
    var HorizontalAlignment;
    (function (HorizontalAlignment) {
        HorizontalAlignment[HorizontalAlignment["Left"] = 0] = "Left";
        HorizontalAlignment[HorizontalAlignment["Center"] = 1] = "Center";
        HorizontalAlignment[HorizontalAlignment["Right"] = 2] = "Right";
        HorizontalAlignment[HorizontalAlignment["Stretch"] = 3] = "Stretch";
    })(HorizontalAlignment = layouts.HorizontalAlignment || (layouts.HorizontalAlignment = {}));
    var SizeToContent;
    (function (SizeToContent) {
        SizeToContent[SizeToContent["None"] = 0] = "None";
        SizeToContent[SizeToContent["Both"] = 1] = "Both";
        SizeToContent[SizeToContent["Vertical"] = 2] = "Vertical";
        SizeToContent[SizeToContent["Horizontal"] = 3] = "Horizontal";
    })(SizeToContent = layouts.SizeToContent || (layouts.SizeToContent = {}));
    var Thickness = (function () {
        function Thickness(left, top, right, bottom) {
            if (left === void 0) { left = 0; }
            if (top === void 0) { top = 0; }
            if (right === void 0) { right = 0; }
            if (bottom === void 0) { bottom = 0; }
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
        Thickness.fromString = function (v) {
            var vTrim = v.trim();
            var tokens = v.split(",");
            if (tokens.length == 1) {
                var sameLen = parseFloat(tokens[0]);
                return new Thickness(sameLen, sameLen, sameLen, sameLen);
            }
            if (tokens.length == 2) {
                var sameLeftRight = parseFloat(tokens[0]);
                var sameTopBottom = parseFloat(tokens[1]);
                return new Thickness(sameLeftRight, sameTopBottom, sameLeftRight, sameTopBottom);
            }
            if (tokens.length == 4) {
                return new Thickness(parseFloat(tokens[0]), parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            }
            throw new Error("Thickness format error");
        };
        Object.defineProperty(Thickness.prototype, "isSameWidth", {
            get: function () {
                return this.left == this.top && this.left == this.right && this.right == this.bottom;
            },
            enumerable: true,
            configurable: true
        });
        return Thickness;
    }());
    layouts.Thickness = Thickness;
    var MinMax = (function () {
        function MinMax(e) {
            this.maxHeight = e.maxHeight;
            this.minHeight = e.minHeight;
            var l = e.height;
            this.height = isNaN(l) ? Infinity : l;
            this.maxHeight = Math.max(Math.min(this.height, this.maxHeight), this.minHeight);
            this.height = isNaN(l) ? 0 : l;
            this.minHeight = Math.max(Math.min(this.maxHeight, this.height), this.minHeight);
            this.maxWidth = e.maxWidth;
            this.minWidth = e.minWidth;
            l = e.width;
            this.width = isNaN(l) ? Infinity : l;
            this.maxWidth = Math.max(Math.min(this.width, this.maxWidth), this.minWidth);
            this.width = isNaN(l) ? 0 : l;
            this.minWidth = Math.max(Math.min(this.maxWidth, this.width), this.minWidth);
        }
        return MinMax;
    }());
    var FrameworkElement = (function (_super) {
        __extends(FrameworkElement, _super);
        function FrameworkElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.visualOffset = null;
            return _this;
        }
        Object.defineProperty(FrameworkElement.prototype, "typeName", {
            get: function () {
                return FrameworkElement.typeName;
            },
            enumerable: true,
            configurable: true
        });
        FrameworkElement.prototype.measureCore = function (availableSize) {
            var margin = this.margin;
            var marginWidth = margin.left + margin.right;
            var marginHeight = margin.top + margin.bottom;
            var frameworkAvailableSize = new layouts.Size(Math.max(availableSize.width - marginWidth, 0), Math.max(availableSize.height - marginHeight, 0));
            var mm = new MinMax(this);
            frameworkAvailableSize.width = Math.max(mm.minWidth, Math.min(frameworkAvailableSize.width, mm.maxWidth));
            frameworkAvailableSize.height = Math.max(mm.minHeight, Math.min(frameworkAvailableSize.height, mm.maxHeight));
            var desideredSize = this.measureOverride(frameworkAvailableSize);
            desideredSize = new layouts.Size(Math.max(desideredSize.width, mm.minWidth), Math.max(desideredSize.height, mm.minHeight));
            this.unclippedDesiredSize = desideredSize;
            if (desideredSize.width > mm.maxWidth) {
                desideredSize.width = mm.maxWidth;
            }
            if (desideredSize.height > mm.maxHeight) {
                desideredSize.height = mm.maxHeight;
            }
            var clippedDesiredWidth = desideredSize.width + marginWidth;
            var clippedDesiredHeight = desideredSize.height + marginHeight;
            if (clippedDesiredWidth > availableSize.width) {
                clippedDesiredWidth = availableSize.width;
            }
            if (clippedDesiredHeight > availableSize.height) {
                clippedDesiredHeight = availableSize.height;
            }
            return new layouts.Size(Math.max(0, clippedDesiredWidth), Math.max(0, clippedDesiredHeight));
        };
        FrameworkElement.prototype.measureOverride = function (availableSize) {
            return new layouts.Size();
        };
        FrameworkElement.prototype.arrangeCore = function (finalRect) {
            var arrangeSize = finalRect.size;
            var margin = this.margin;
            var marginWidth = margin.left + margin.right;
            var marginHeight = margin.top + margin.bottom;
            arrangeSize.width = Math.max(0, arrangeSize.width - marginWidth);
            arrangeSize.height = Math.max(0, arrangeSize.height - marginHeight);
            if (arrangeSize.width.isCloseTo(this.unclippedDesiredSize.width) ||
                arrangeSize.width < this.unclippedDesiredSize.width) {
                arrangeSize.width = this.unclippedDesiredSize.width;
            }
            if (arrangeSize.height.isCloseTo(this.unclippedDesiredSize.height) ||
                arrangeSize.height < this.unclippedDesiredSize.height) {
                arrangeSize.height = this.unclippedDesiredSize.height;
            }
            if (this.horizontalAlignment != HorizontalAlignment.Stretch) {
                arrangeSize.width = this.unclippedDesiredSize.width;
            }
            if (this.verticalAlignment != VerticalAlignment.Stretch) {
                arrangeSize.height = this.unclippedDesiredSize.height;
            }
            var mm = new MinMax(this);
            var effectiveMaxWidth = Math.max(this.unclippedDesiredSize.width, mm.maxWidth);
            if (effectiveMaxWidth.isCloseTo(arrangeSize.width) ||
                effectiveMaxWidth < arrangeSize.width) {
                arrangeSize.width = effectiveMaxWidth;
            }
            var effectiveMaxHeight = Math.max(this.unclippedDesiredSize.height, mm.maxHeight);
            if (effectiveMaxHeight.isCloseTo(arrangeSize.height) ||
                effectiveMaxHeight < arrangeSize.height) {
                arrangeSize.height = effectiveMaxHeight;
            }
            var oldRenderSize = this.renderSize;
            var innerInkSize = this.arrangeOverride(arrangeSize);
            if (innerInkSize == null)
                throw new Error("arrangeOverride() can't return null");
            this.renderSize = innerInkSize;
            this.setActualWidth(innerInkSize.width);
            this.setActualHeight(innerInkSize.height);
            var clippedInkSize = new layouts.Size(Math.min(innerInkSize.width, mm.maxWidth), Math.min(innerInkSize.height, mm.maxHeight));
            var clientSize = new layouts.Size(Math.max(0, finalRect.width - marginWidth), Math.max(0, finalRect.height - marginHeight));
            var offset = this.computeAlignmentOffset(clientSize, clippedInkSize);
            offset.x += finalRect.x + margin.left;
            offset.y += finalRect.y + margin.top;
            var oldOffset = this.visualOffset;
            if (oldOffset == null ||
                (!oldOffset.x.isCloseTo(offset.x) || !oldOffset.y.isCloseTo(offset.y)))
                this.visualOffset = offset;
        };
        FrameworkElement.prototype.computeAlignmentOffset = function (clientSize, inkSize) {
            var offset = new layouts.Vector();
            var ha = this.horizontalAlignment;
            var va = this.verticalAlignment;
            if (ha == HorizontalAlignment.Stretch
                && inkSize.width > clientSize.width) {
                ha = HorizontalAlignment.Left;
            }
            if (va == VerticalAlignment.Stretch
                && inkSize.height > clientSize.height) {
                va = VerticalAlignment.Top;
            }
            if (ha == HorizontalAlignment.Center
                || ha == HorizontalAlignment.Stretch) {
                offset.x = (clientSize.width - inkSize.width) * 0.5;
            }
            else if (ha == HorizontalAlignment.Right) {
                offset.x = clientSize.width - inkSize.width;
            }
            else {
                offset.x = 0;
            }
            if (va == VerticalAlignment.Center
                || va == VerticalAlignment.Stretch) {
                offset.y = (clientSize.height - inkSize.height) * 0.5;
            }
            else if (va == VerticalAlignment.Bottom) {
                offset.y = clientSize.height - inkSize.height;
            }
            else {
                offset.y = 0;
            }
            return offset;
        };
        FrameworkElement.prototype.arrangeOverride = function (finalSize) {
            return finalSize;
        };
        FrameworkElement.prototype.layoutOverride = function () {
            _super.prototype.layoutOverride.call(this);
            if (this._visual == null)
                return;
            this._visual.style.visibility = this.isVisible ? "" : "collapsed";
            this._visual.style.overflowX = this.overflowX;
            this._visual.style.overflowY = this.overflowY;
            if (this.visualOffset != null) {
                this._visual.style.left = this.visualOffset.x.toString() + "px";
                this._visual.style.top = this.visualOffset.y.toString() + "px";
            }
            if (this.renderSize != null) {
                this._visual.style.width = this.renderSize.width.toString() + "px";
                this._visual.style.height = this.renderSize.height.toString() + "px";
            }
        };
        Object.defineProperty(FrameworkElement.prototype, "width", {
            get: function () {
                return this.getValue(FrameworkElement.widthProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.widthProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "height", {
            get: function () {
                return this.getValue(FrameworkElement.heightProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.heightProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "actualWidth", {
            get: function () {
                return this.getValue(FrameworkElement.actualWidthProperty);
            },
            enumerable: true,
            configurable: true
        });
        FrameworkElement.prototype.setActualWidth = function (value) {
            this.setValue(FrameworkElement.actualWidthProperty, value);
        };
        Object.defineProperty(FrameworkElement.prototype, "actualHeight", {
            get: function () {
                return this.getValue(FrameworkElement.actualHeightProperty);
            },
            enumerable: true,
            configurable: true
        });
        FrameworkElement.prototype.setActualHeight = function (value) {
            this.setValue(FrameworkElement.actualHeightProperty, value);
        };
        Object.defineProperty(FrameworkElement.prototype, "minWidth", {
            get: function () {
                return this.getValue(FrameworkElement.minWidthProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.minWidthProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "minHeight", {
            get: function () {
                return this.getValue(FrameworkElement.minHeightProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.minHeightProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "maxWidth", {
            get: function () {
                return this.getValue(FrameworkElement.maxWidthProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.maxWidthProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "maxHeight", {
            get: function () {
                return this.getValue(FrameworkElement.maxHeightProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.maxHeightProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "verticalAlignment", {
            get: function () {
                return this.getValue(FrameworkElement.verticalAlignmentProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.verticalAlignmentProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "horizontalAlignment", {
            get: function () {
                return this.getValue(FrameworkElement.horizontalAlignmentProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.horizontalAlignmentProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "margin", {
            get: function () {
                return this.getValue(FrameworkElement.marginProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.marginProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "dataContext", {
            get: function () {
                return this.getValue(FrameworkElement.dataContextProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.dataContextProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "parentDataContext", {
            get: function () {
                if (this.parent != null)
                    return this.parent.getValue(FrameworkElement.dataContextProperty);
                return null;
            },
            enumerable: true,
            configurable: true
        });
        FrameworkElement.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
            _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            if (property == FrameworkElement.dataContextProperty)
                _super.prototype.onPropertyChanged.call(this, "parentDataContext", this.parentDataContext, null);
        };
        FrameworkElement.prototype.onParentChanged = function (oldParent, newParent) {
            _super.prototype.onParentChanged.call(this, oldParent, newParent);
            _super.prototype.onPropertyChanged.call(this, "parentDataContext", newParent, oldParent);
        };
        Object.defineProperty(FrameworkElement.prototype, "tag", {
            get: function () {
                return this.getValue(FrameworkElement.tagProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.tagProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "overflowX", {
            get: function () {
                return this.getValue(FrameworkElement.overflowXProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.overflowXProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "overflowY", {
            get: function () {
                return this.getValue(FrameworkElement.overflowYProperty);
            },
            set: function (value) {
                this.setValue(FrameworkElement.overflowYProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        return FrameworkElement;
    }(layouts.UIElement));
    FrameworkElement.typeName = "layouts.FrameworkElement";
    FrameworkElement.widthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Width", Number.NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
    FrameworkElement.heightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Height", Number.NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
    FrameworkElement.actualWidthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "ActualWidth", 0);
    FrameworkElement.actualHeightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "ActualHeight", 0);
    FrameworkElement.minWidthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MinWidth", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
    FrameworkElement.minHeightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MinHeight", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
    FrameworkElement.maxWidthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MaxWidth", Infinity, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
    FrameworkElement.maxHeightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MaxHeight", Infinity, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
    FrameworkElement.verticalAlignmentProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "VerticalAlignment", VerticalAlignment.Stretch, layouts.FrameworkPropertyMetadataOptions.AffectsArrange, function (v) { return VerticalAlignment[String(v)]; });
    FrameworkElement.horizontalAlignmentProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "HorizontalAlignment", HorizontalAlignment.Stretch, layouts.FrameworkPropertyMetadataOptions.AffectsArrange, function (v) { return HorizontalAlignment[String(v)]; });
    FrameworkElement.marginProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Margin", new Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Thickness.fromString(v); });
    FrameworkElement.dataContextProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "DataContext", null, layouts.FrameworkPropertyMetadataOptions.Inherits);
    FrameworkElement.tagProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Tag");
    FrameworkElement.overflowXProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "OverflowX", "hidden", layouts.FrameworkPropertyMetadataOptions.AffectsRender);
    FrameworkElement.overflowYProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "OverflowY", "hidden", layouts.FrameworkPropertyMetadataOptions.AffectsRender);
    layouts.FrameworkElement = FrameworkElement;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var PopupPosition;
        (function (PopupPosition) {
            PopupPosition[PopupPosition["Center"] = 0] = "Center";
            PopupPosition[PopupPosition["Left"] = 1] = "Left";
            PopupPosition[PopupPosition["LeftTop"] = 2] = "LeftTop";
            PopupPosition[PopupPosition["LeftBottom"] = 3] = "LeftBottom";
            PopupPosition[PopupPosition["Top"] = 4] = "Top";
            PopupPosition[PopupPosition["TopLeft"] = 5] = "TopLeft";
            PopupPosition[PopupPosition["TopRight"] = 6] = "TopRight";
            PopupPosition[PopupPosition["Right"] = 7] = "Right";
            PopupPosition[PopupPosition["RightTop"] = 8] = "RightTop";
            PopupPosition[PopupPosition["RightBottom"] = 9] = "RightBottom";
            PopupPosition[PopupPosition["Bottom"] = 10] = "Bottom";
            PopupPosition[PopupPosition["BottomLeft"] = 11] = "BottomLeft";
            PopupPosition[PopupPosition["BottomRight"] = 12] = "BottomRight";
        })(PopupPosition = controls.PopupPosition || (controls.PopupPosition = {}));
        var Popup = (function (_super) {
            __extends(Popup, _super);
            function Popup() {
                return _super.call(this) || this;
            }
            Object.defineProperty(Popup.prototype, "typeName", {
                get: function () {
                    return Popup.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Popup.initProperties = function () {
                layouts.FrameworkElement.horizontalAlignmentProperty.overrideDefaultValue(Popup.typeName, "Center");
                layouts.FrameworkElement.verticalAlignmentProperty.overrideDefaultValue(Popup.typeName, "Center");
            };
            Popup.prototype.tryLoadChildFromServer = function () {
                var _this = this;
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (ev) {
                    if (req.readyState == 4 && req.status == 200) {
                        var loader = new layouts.XamlReader();
                        _this._child = loader.Parse(req.responseText);
                        if (_this._child != null)
                            _this.setupChild();
                    }
                };
                req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
                req.send();
            };
            Object.defineProperty(Popup.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    if (this._child != value) {
                        this._child = value;
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Popup.prototype.onShow = function () {
                if (this._child == null)
                    this._child = this.initializeComponent();
                if (this._child != null)
                    this.setupChild();
                else
                    this.tryLoadChildFromServer();
            };
            Popup.prototype.setupChild = function () {
                this._child.parent = this;
                this._popupContainer = document.createElement("div");
                this._popupContainer.style.width = this._popupContainer.style.height = "100%";
                this._popupContainer.style.position = "fixed";
                this._popupContainer.className = "layoutsPopupContainer";
                if (this.cssClass != null)
                    this._popupContainer.className = this.cssClass;
                document.body.appendChild(this._popupContainer);
                this._child.attachVisual(this._popupContainer);
                var currentThis = this;
                this._popupContainer.addEventListener("mousedown", function (event) {
                    if (event.target == currentThis._popupContainer) {
                        this.removeEventListener("mousedown", arguments.callee);
                        layouts.LayoutManager.closePopup(currentThis);
                    }
                });
            };
            Popup.prototype.onClose = function () {
                if (this._child != null && this._child.parent == this) {
                    this._child.attachVisual(null);
                    this._child.parent = null;
                    document.body.removeChild(this._popupContainer);
                    this._popupContainer = null;
                }
            };
            Popup.prototype.initializeComponent = function () {
                return null;
            };
            Popup.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this.child;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            Popup.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                if (this._child != null) {
                    this._child.measure(constraint);
                    return this._child.desiredSize;
                }
                return mySize;
            };
            Popup.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                if (child != null) {
                    child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                }
                return finalSize;
            };
            Object.defineProperty(Popup.prototype, "sizeToContent", {
                get: function () {
                    return this.getValue(Popup.sizeToContentProperty);
                },
                set: function (value) {
                    this.setValue(Popup.sizeToContentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "position", {
                get: function () {
                    return this.getValue(Popup.positionProperty);
                },
                set: function (value) {
                    this.setValue(Popup.positionProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Popup;
        }(layouts.FrameworkElement));
        Popup.typeName = "layouts.controls.Popup";
        Popup._init = Popup.initProperties();
        Popup.sizeToContentProperty = layouts.DepObject.registerProperty(Popup.typeName, "SizeToContent", layouts.SizeToContent.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.SizeToContent[String(v)]; });
        Popup.positionProperty = layouts.DepObject.registerProperty(Popup.typeName, "Position", PopupPosition.Center, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return PopupPosition[String(v)]; });
        controls.Popup = Popup;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var LayoutManager = (function () {
        function LayoutManager() {
        }
        LayoutManager.updateLayout = function () {
            var page = layouts.Application.current.page;
            var docWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
            var docHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
            if (page != null) {
                var sizeToContentWidth = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Vertical;
                page.measure(new layouts.Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                page.arrange(new layouts.Rect(0, 0, sizeToContentWidth ? page.desiredSize.width : docWidth, sizeToContentHeight ? page.desiredSize.height : docHeight));
                page.layout();
            }
            LayoutManager.popups.forEach(function (popup) {
                var sizeToContentWidth = popup.sizeToContent == layouts.SizeToContent.Both || popup.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = popup.sizeToContent == layouts.SizeToContent.Both || popup.sizeToContent == layouts.SizeToContent.Vertical;
                popup.measure(new layouts.Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                var relativeTo = popup.parent;
                var left = 0, top = 0;
                var finalWidth = sizeToContentWidth ? popup.desiredSize.width : docWidth;
                var finalHeight = sizeToContentHeight ? popup.desiredSize.height : docHeight;
                if (relativeTo != null && popup.position != layouts.controls.PopupPosition.Center) {
                    var relativeBound = relativeTo.getBoundingClientRect();
                    if (popup.position == layouts.controls.PopupPosition.Left ||
                        popup.position == layouts.controls.PopupPosition.LeftBottom ||
                        popup.position == layouts.controls.PopupPosition.LeftTop) {
                        left = relativeBound.left - finalWidth;
                        if (popup.position == layouts.controls.PopupPosition.Left)
                            top = relativeBound.top + relativeBound.height / 2 - finalHeight / 2;
                        else if (popup.position == layouts.controls.PopupPosition.LeftBottom)
                            top = relativeBound.bottom - finalHeight;
                        else if (popup.position == layouts.controls.PopupPosition.LeftTop)
                            top = relativeBound.top;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Right ||
                        popup.position == layouts.controls.PopupPosition.RightBottom ||
                        popup.position == layouts.controls.PopupPosition.RightTop) {
                        left = relativeBound.right;
                        if (popup.position == layouts.controls.PopupPosition.Right)
                            top = relativeBound.top + relativeBound.height / 2 - finalHeight / 2;
                        else if (popup.position == layouts.controls.PopupPosition.RightBottom)
                            top = relativeBound.bottom - finalHeight;
                        else if (popup.position == layouts.controls.PopupPosition.RightTop)
                            top = relativeBound.top;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Top ||
                        popup.position == layouts.controls.PopupPosition.TopLeft ||
                        popup.position == layouts.controls.PopupPosition.TopRight) {
                        top = relativeBound.top - popup.desiredSize.height;
                        if (popup.position == layouts.controls.PopupPosition.Top)
                            left = relativeBound.left + relativeBound.width / 2 - finalWidth / 2;
                        else if (popup.position == layouts.controls.PopupPosition.TopLeft)
                            left = relativeBound.left;
                        else if (popup.position == layouts.controls.PopupPosition.TopRight)
                            left = relativeBound.right - finalWidth;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Bottom ||
                        popup.position == layouts.controls.PopupPosition.BottomLeft ||
                        popup.position == layouts.controls.PopupPosition.BottomRight) {
                        top = relativeBound.bottom;
                        if (popup.position == layouts.controls.PopupPosition.Bottom)
                            left = relativeBound.left + relativeBound.width / 2 - finalWidth / 2;
                        else if (popup.position == layouts.controls.PopupPosition.BottomLeft)
                            left = relativeBound.left;
                        else if (popup.position == layouts.controls.PopupPosition.BottomRight)
                            left = relativeBound.right - finalWidth;
                    }
                }
                else {
                    left = docWidth / 2 - finalWidth / 2;
                    top = docHeight / 2 - finalHeight / 2;
                }
                popup.arrange(new layouts.Rect(left, top, finalWidth, finalHeight));
                popup.layout();
            });
        };
        LayoutManager.showPopup = function (popup) {
            if (LayoutManager.popups.indexOf(popup) == -1) {
                LayoutManager.popups.push(popup);
                popup.onShow();
                LayoutManager.updateLayout();
            }
        };
        LayoutManager.closePopup = function (popup) {
            var indexOfElement = popup == null ? LayoutManager.popups.length - 1 : LayoutManager.popups.indexOf(popup);
            if (indexOfElement > -1) {
                popup = LayoutManager.popups.splice(indexOfElement)[0];
                popup.onClose();
                LayoutManager.updateLayout();
            }
        };
        return LayoutManager;
    }());
    LayoutManager.popups = [];
    layouts.LayoutManager = LayoutManager;
    window.onresize = function () {
        LayoutManager.updateLayout();
    };
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var NavigationContext = (function () {
            function NavigationContext(previousPage, previousUri, nextPage, nextUri, queryString) {
                this.previousPage = previousPage;
                this.previousUri = previousUri;
                this.nextPage = nextPage;
                this.nextUri = nextUri;
                this.queryString = queryString;
                this.cancel = false;
                this.returnUri = null;
            }
            return NavigationContext;
        }());
        controls.NavigationContext = NavigationContext;
        var Page = (function (_super) {
            __extends(Page, _super);
            function Page() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.cachePage = false;
                return _this;
            }
            Object.defineProperty(Page.prototype, "typeName", {
                get: function () {
                    return Page.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Page.prototype.tryLoadChildFromServer = function () {
                var _this = this;
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (ev) {
                    if (req.readyState == 4 && req.status == 200) {
                        var loader = new layouts.XamlReader();
                        _this.child = loader.Parse(req.responseText);
                    }
                };
                req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
                req.send();
            };
            Page.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                var child = this.child;
                if (child != null) {
                    child.parent = this;
                    child.attachVisual(this._container);
                }
                else {
                    this.tryLoadChildFromServer();
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Page.prototype.layoutOverride = function () {
                var child = this.child;
                if (child != null)
                    child.layout();
            };
            Page.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                var child = this.child;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return mySize;
            };
            Page.prototype.arrangeOverride = function (finalSize) {
                var child = this.child;
                if (child != null) {
                    child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                }
                return finalSize;
            };
            Object.defineProperty(Page.prototype, "child", {
                get: function () {
                    return this.getValue(Page.childProperty);
                },
                set: function (value) {
                    this.setValue(Page.childProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Page.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Page.childProperty) {
                    var oldChild = oldValue;
                    if (oldChild != null && oldChild.parent == this) {
                        oldChild.parent = null;
                        oldChild.attachVisual(null);
                    }
                    var newChild = value;
                    if (newChild != null) {
                        newChild.parent = this;
                        if (this._container != null)
                            newChild.attachVisual(this._container);
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(Page.prototype, "sizeToContent", {
                get: function () {
                    return this.getValue(Page.sizeToContentProperty);
                },
                set: function (value) {
                    this.setValue(Page.sizeToContentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Page.prototype.onNavigate = function (context) {
            };
            return Page;
        }(layouts.FrameworkElement));
        Page.typeName = "layouts.controls.Page";
        Page.childProperty = layouts.DepObject.registerProperty(Page.typeName, "Child", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Page.sizeToContentProperty = layouts.DepObject.registerProperty(Page.typeName, "SizeToContent", layouts.SizeToContent.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.SizeToContent[String(v)]; });
        controls.Page = Page;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var UriMapping = (function () {
        function UriMapping(uri, mapping) {
            this.uri = uri;
            this._compiled = false;
            this._queryStringTokens = new Array();
            this.mapping = mapping;
        }
        Object.defineProperty(UriMapping.prototype, "mapping", {
            get: function () {
                return this._mapping;
            },
            set: function (value) {
                var re = /(\/|\\)/gi;
                this._mapping = value.replace(re, '.');
            },
            enumerable: true,
            configurable: true
        });
        UriMapping.prototype.compile = function () {
            if (!this._compiled) {
                var re = new RegExp("\\{([\\w\\d_&$-]+)\\}", "gi");
                var s = this.uri;
                var m;
                var rx = this.uri.split("/").join("\\/");
                do {
                    m = re.exec(s);
                    if (m) {
                        rx = rx.replace(m[0], "([\\w\\d_&$-]+)");
                        this._queryStringTokens.push(m[1]);
                    }
                } while (m);
                this._compiledUri = new RegExp(rx, "gi");
                this._compiled = true;
            }
        };
        UriMapping.prototype.test = function (uri) {
            this.compile();
            this._compiledUri.lastIndex = 0;
            return this._compiledUri.test(uri);
        };
        UriMapping.prototype.resolve = function (uriToResolve) {
            this.compile();
            var match;
            var re = this._compiledUri;
            var result = {};
            var i = 0;
            this._compiledUri.lastIndex = 0;
            var m = re.exec(uriToResolve);
            for (var i = 1; i < m.length; i++) {
                result[this._queryStringTokens[i - 1]] = m[i];
            }
            return result;
        };
        return UriMapping;
    }());
    UriMapping._rxMapping = new RegExp("\{([\w\d_&$]+)\}", "gi");
    layouts.UriMapping = UriMapping;
    var NavigationItem = (function () {
        function NavigationItem(uri) {
            this.uri = uri;
        }
        return NavigationItem;
    }());
    var Application = (function () {
        function Application() {
            var _this = this;
            this._mappings = [];
            this._cachedPages = {};
            if (Application._current != null)
                throw new Error("Application already initialized");
            Application._current = this;
            if ("onhashchange" in window) {
                window.onhashchange = function (ev) {
                    return _this.hashChanged(window.location.hash);
                };
            }
            else {
                var storedHash = window.location.hash;
                window.setInterval(function () {
                    if (window.location.hash != storedHash) {
                        storedHash = window.location.hash;
                        _this.hashChanged(storedHash);
                    }
                }, 100);
            }
        }
        Object.defineProperty(Application, "current", {
            get: function () {
                if (Application._current == null)
                    Application._current = new Application();
                return Application._current;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "page", {
            get: function () {
                return this._page;
            },
            set: function (page) {
                if (this._page != page) {
                    if (this._page != null)
                        this._page.attachVisual(null);
                    this._page = page;
                    if (this._page != null)
                        this._page.attachVisual(document.body);
                    Application.requestAnimationFrame();
                }
            },
            enumerable: true,
            configurable: true
        });
        Application.requestAnimationFrame = function () {
            requestAnimationFrame(Application.onAnimationFrame);
        };
        Application.onAnimationFrame = function () {
            layouts.LayoutManager.updateLayout();
            Application._beginInvokeActions.forEach(function (action) { action(); });
            Application._beginInvokeActions = [];
            requestAnimationFrame(Application.onAnimationFrame);
        };
        Application.beginInvoke = function (action) {
            Application._beginInvokeActions.push(action);
        };
        Object.defineProperty(Application.prototype, "mappings", {
            get: function () {
                return this._mappings;
            },
            enumerable: true,
            configurable: true
        });
        Application.prototype.map = function (uri, mappedUri) {
            var uriMapping = this._mappings.firstOrDefault(function (m) { return m.uri == uri; }, null);
            if (uriMapping == null) {
                uriMapping = new UriMapping(uri, mappedUri);
                this._mappings.push(uriMapping);
            }
            uriMapping.mapping = mappedUri;
            return uriMapping;
        };
        Application.prototype.navigate = function (uri, loader) {
            if (uri == null) {
                uri = window.location.hash.length > 0 ?
                    window.location.hash.slice(1) : layouts.Consts.stringEmpty;
            }
            if (this._currentUri == uri)
                return true;
            var uriMapping = this._mappings.firstOrDefault(function (m) { return m.test(uri); }, null);
            if (uriMapping != null) {
                var queryString = uriMapping.resolve(uri);
                var previousPage = this.page;
                var previousUri = this._currentUri;
                var targetPage = null;
                if (uriMapping.mapping in this._cachedPages)
                    targetPage = this._cachedPages[uriMapping.mapping];
                else {
                    if (loader == null)
                        loader = new InstanceLoader(window);
                    targetPage = loader.getInstance(uriMapping.mapping);
                    if (targetPage == null) {
                        throw new Error("Unable to navigate to page '{0}'".format(uriMapping.mapping));
                    }
                }
                if (targetPage.cachePage) {
                    if (!(targetPage.typeName in this._cachedPages))
                        this._cachedPages[uriMapping.mapping] = targetPage;
                }
                var navContext = new layouts.controls.NavigationContext(previousPage, previousUri, targetPage, uri, queryString);
                navContext.returnUri = this._returnUri;
                if (this.onBeforeNavigate != null) {
                    var nextUri = navContext.nextUri;
                    this.onBeforeNavigate(navContext);
                    if (navContext.cancel) {
                        if (previousUri != null &&
                            window.location.hash != "#" + previousUri)
                            window.location.hash = "#" + previousUri;
                        this._returnUri = navContext.returnUri;
                        if (nextUri != navContext.nextUri)
                            this.navigate(navContext.nextUri);
                        return false;
                    }
                }
                this._currentUri = uri;
                this.page = targetPage;
                this.page.onNavigate(navContext);
                if (window.location.hash != "#" + uri)
                    window.location.hash = "#" + uri;
                if (this.onAfterNavigate != null) {
                    this.onAfterNavigate(navContext);
                }
            }
            return (uriMapping != null);
        };
        Application.prototype.hashChanged = function (hash) {
            this.navigate(hash.slice(1));
        };
        return Application;
    }());
    Application._beginInvokeActions = [];
    layouts.Application = Application;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var Command = (function () {
        function Command(executeHandler, canExecuteHandler) {
            this.executeHandler = executeHandler;
            this.canExecuteHandler = canExecuteHandler;
            this.handlers = [];
        }
        Command.prototype.canExecute = function (parameter) {
            if (this.executeHandler == null)
                return false;
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
    }());
    layouts.Command = Command;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var CornerRadius = (function () {
            function CornerRadius(topleft, topright, bottomright, bottomleft) {
                if (topleft === void 0) { topleft = 0; }
                if (topright === void 0) { topright = null; }
                if (bottomright === void 0) { bottomright = null; }
                if (bottomleft === void 0) { bottomleft = null; }
                this.topleft = topleft;
                this.topright = topright;
                this.bottomright = bottomright;
                this.bottomleft = bottomleft;
                if (topright == null)
                    topright = this.topleft;
                if (bottomright == null)
                    bottomright = this.topleft;
                if (bottomleft == null)
                    bottomleft = this.topleft;
            }
            return CornerRadius;
        }());
        controls.CornerRadius = CornerRadius;
        var Border = (function (_super) {
            __extends(Border, _super);
            function Border() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Border.prototype, "typeName", {
                get: function () {
                    return Border.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    if (this._child != value) {
                        if (this._child != null && this._child.parent == this) {
                            this._child.parent = null;
                            this._child.attachVisual(null);
                        }
                        this._child = value;
                        if (this._child != null) {
                            this._child.parent = this;
                            if (this._divElement != null)
                                this._child.attachVisual(this._divElement);
                        }
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Border.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._divElement = document.createElement("div");
                this.updateVisualProperties();
                if (this._child != null) {
                    this._child.attachVisual(this._divElement);
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Border.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                var borderThickness = this.borderThickness;
                if (borderThickness == null)
                    borderThickness = new layouts.Thickness();
                var border = new layouts.Size(borderThickness.left + borderThickness.right, borderThickness.top + borderThickness.bottom);
                var padding = new layouts.Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
                if (this._child != null) {
                    var combined = new layouts.Size(border.width + padding.width, border.height + padding.height);
                    var childConstraint = new layouts.Size(Math.max(0.0, constraint.width - combined.width), Math.max(0.0, constraint.height - combined.height));
                    this._child.measure(childConstraint);
                    var childSize = this._child.desiredSize;
                    mySize.width = childSize.width + combined.width;
                    mySize.height = childSize.height + combined.height;
                }
                else {
                    mySize = new layouts.Size(border.width + padding.width, border.height + padding.height);
                }
                return mySize;
            };
            Border.prototype.arrangeOverride = function (finalSize) {
                var borderThickness = this.borderThickness;
                if (borderThickness == null)
                    borderThickness = new layouts.Thickness();
                var boundRect = new layouts.Rect(0, 0, finalSize.width, finalSize.height);
                var innerRect = new layouts.Rect(boundRect.x + borderThickness.left, boundRect.y + borderThickness.top, Math.max(0.0, boundRect.width - borderThickness.left - borderThickness.right), Math.max(0.0, boundRect.height - borderThickness.top - borderThickness.bottom));
                var child = this._child;
                var padding = this.padding;
                if (child != null) {
                    var childRect = new layouts.Rect(innerRect.x + padding.left, innerRect.y + padding.top, Math.max(0.0, innerRect.width - padding.left - padding.right), Math.max(0.0, innerRect.height - padding.top - padding.bottom));
                    child.arrange(childRect);
                }
                return finalSize;
            };
            Border.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var borderThickness = this.borderThickness;
                if (borderThickness == null)
                    borderThickness = new layouts.Thickness();
                if (this._visual != null && this.renderSize != null) {
                    this._visual.style.width = (this.renderSize.width - (borderThickness.left + borderThickness.right)).toString() + "px";
                    this._visual.style.height = (this.renderSize.height - (borderThickness.top + borderThickness.bottom)).toString() + "px";
                }
                if (this._child != null)
                    this._child.layout();
            };
            Border.prototype.updateVisualProperties = function () {
                if (this._visual == null)
                    return;
                this._visual.style.background = this.background;
                if (this.borderBrush != null)
                    this._visual.style.borderColor = this.borderBrush;
                if (this.borderStyle != null)
                    this._visual.style.borderStyle = this.borderStyle;
                var borderThickness = this.borderThickness;
                if (borderThickness != null) {
                    if (borderThickness.isSameWidth)
                        this._visual.style.borderWidth = borderThickness.left.toString() + "px";
                    else {
                        this._visual.style.borderLeft = borderThickness.left.toString() + "px";
                        this._visual.style.borderTop = borderThickness.top.toString() + "px";
                        this._visual.style.borderRight = borderThickness.right.toString() + "px";
                        this._visual.style.borderBottom = borderThickness.bottom.toString() + "px";
                    }
                }
            };
            Border.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Border.borderThicknessProperty ||
                    property == Border.backgroundProperty ||
                    property == Border.borderBrushProperty)
                    this.updateVisualProperties();
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(Border.prototype, "borderThickness", {
                get: function () {
                    return this.getValue(Border.borderThicknessProperty);
                },
                set: function (value) {
                    this.setValue(Border.borderThicknessProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "padding", {
                get: function () {
                    return this.getValue(Border.paddingProperty);
                },
                set: function (value) {
                    this.setValue(Border.paddingProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "background", {
                get: function () {
                    return this.getValue(Border.backgroundProperty);
                },
                set: function (value) {
                    this.setValue(Border.backgroundProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "borderBrush", {
                get: function () {
                    return this.getValue(Border.borderBrushProperty);
                },
                set: function (value) {
                    this.setValue(Border.borderBrushProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "borderStyle", {
                get: function () {
                    return this.getValue(Border.borderStyleProperty);
                },
                set: function (value) {
                    this.setValue(Border.borderStyleProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Border;
        }(layouts.FrameworkElement));
        Border.typeName = "layouts.controls.Border";
        Border.borderThicknessProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderThickness", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.Thickness.fromString(v); });
        Border.paddingProperty = layouts.DepObject.registerProperty(Border.typeName, "Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.Thickness.fromString(v); });
        Border.backgroundProperty = layouts.DepObject.registerProperty(Border.typeName, "Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Border.borderBrushProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderBrush", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Border.borderStyleProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderStyle", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.Border = Border;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Button.prototype, "typeName", {
                get: function () {
                    return Button.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    if (this._child != value) {
                        if (this._child != null && this._child.parent == this)
                            this._child.parent = null;
                        this._child = value;
                        if (this._child != null) {
                            this._child.parent = this;
                            if (this._buttonElement != null)
                                this._child.attachVisual(this._buttonElement);
                        }
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Button.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._buttonElement = document.createElement("button");
                this._visual.style.msUserSelect =
                    this._visual.style.webkitUserSelect = "none";
                if (this._child != null) {
                    this._child.attachVisual(this._buttonElement);
                }
                this._buttonElement.disabled = !this.isEnabled;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Button.prototype.measureOverride = function (constraint) {
                this.isEnabled = this.popup != null || (this.command != null && this.command.canExecute(this.commandParameter));
                var mySize = new layouts.Size();
                var padding = new layouts.Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
                if (this._child != null) {
                    var childConstraint = new layouts.Size(Math.max(0.0, constraint.width - padding.width), Math.max(0.0, constraint.height - padding.height));
                    this._child.measure(childConstraint);
                    var childSize = this._child.desiredSize;
                    mySize.width = childSize.width + padding.width;
                    mySize.height = childSize.height + padding.height;
                }
                else if (this.text != null) {
                    var text = this.text;
                    var mySize = new layouts.Size();
                    var pElement = this._buttonElement;
                    var txtChanged = (pElement.innerText !== text);
                    if (isFinite(constraint.width))
                        pElement.style.maxWidth = constraint.width + "px";
                    if (isFinite(constraint.height))
                        pElement.style.maxHeight = constraint.height + "px";
                    pElement.style.width = "auto";
                    pElement.style.height = "auto";
                    pElement.style.whiteSpace = this.whiteSpace;
                    if (txtChanged) {
                        pElement.innerHTML = this.text;
                    }
                    mySize = new layouts.Size(pElement.offsetWidth, pElement.offsetHeight);
                    if (this.renderSize != null) {
                        pElement.style.width = this.renderSize.width.toString() + "px";
                        pElement.style.height = this.renderSize.height.toString() + "px";
                    }
                    return mySize;
                }
                else {
                    mySize = new layouts.Size(padding.width, padding.height);
                }
                return mySize;
            };
            Button.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                var padding = this.padding;
                if (child != null) {
                    var childRect = new layouts.Rect(padding.left, padding.top, Math.max(0.0, finalSize.width - padding.left - padding.right), Math.max(0.0, finalSize.height - padding.top - padding.bottom));
                    child.arrange(childRect);
                }
                return finalSize;
            };
            Button.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                if (this._child != null)
                    this._child.layout();
            };
            Button.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Button.commandProperty) {
                    if (oldValue != null)
                        oldValue.offCanExecuteChangeNotify(this);
                    if (value != null)
                        value.onCanExecuteChangeNotify(this);
                }
                else if (property == Button.isEnabledProperty) {
                    if (this._buttonElement != null)
                        this._buttonElement.disabled = !value;
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Button.prototype.onCommandCanExecuteChanged = function (command) {
                this.isEnabled = this.popup != null || (this.command != null && this.command.canExecute(this.commandParameter));
            };
            Object.defineProperty(Button.prototype, "padding", {
                get: function () {
                    return this.getValue(Button.paddingProperty);
                },
                set: function (value) {
                    this.setValue(Button.paddingProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "text", {
                get: function () {
                    return this.getValue(Button.textProperty);
                },
                set: function (value) {
                    this.setValue(Button.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "whiteSpace", {
                get: function () {
                    return this.getValue(Button.whiteSpaceProperty);
                },
                set: function (value) {
                    this.setValue(Button.whiteSpaceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "isEnabled", {
                get: function () {
                    return this.getValue(Button.isEnabledProperty);
                },
                set: function (value) {
                    this.setValue(Button.isEnabledProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Button;
        }(layouts.FrameworkElement));
        Button.typeName = "layouts.controls.Button";
        Button.paddingProperty = layouts.DepObject.registerProperty(Button.typeName, "Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Button.textProperty = layouts.DepObject.registerProperty(Button.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Button.whiteSpaceProperty = layouts.DepObject.registerProperty(Button.typeName, "WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Button.isEnabledProperty = layouts.DepObject.registerProperty(Button.typeName, "IsEnabled", true, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.Button = Button;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.virtualItemCount = 0;
                _this.virtualOffset = null;
                return _this;
            }
            Object.defineProperty(Panel.prototype, "typeName", {
                get: function () {
                    return Panel.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Panel.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._divElement = document.createElement("div");
                if (this.children != null)
                    this.children.forEach(function (child) { return child.attachVisual(_this._divElement); });
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Object.defineProperty(Panel.prototype, "children", {
                get: function () {
                    return this._children;
                },
                set: function (value) {
                    var _this = this;
                    if (value == this._children)
                        return;
                    if (this._children != null) {
                        this._children.forEach(function (el) {
                            if (el.parent == _this) {
                                el.parent = null;
                                el.attachVisual(null);
                            }
                        });
                        this._children.offChangeNotify(this);
                    }
                    this._children = value;
                    if (this._children != null) {
                        this._children.forEach(function (el) {
                            if (el.parent != null) {
                                throw new Error("Element already child of another element, please remove it first from previous container");
                            }
                            el.parent = _this;
                            if (_this._visual != null)
                                el.attachVisual(_this._visual);
                        });
                        this._children.onChangeNotify(this);
                    }
                    this.invalidateMeasure();
                },
                enumerable: true,
                configurable: true
            });
            Panel.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                var _this = this;
                removed.forEach(function (el) {
                    var element = el;
                    if (element.parent == _this) {
                        element.parent = null;
                        element.attachVisual(null);
                    }
                });
                added.forEach(function (el) {
                    var element = el;
                    element.parent = _this;
                    if (_this._visual != null)
                        element.attachVisual(_this._visual);
                });
                this.invalidateMeasure();
            };
            Panel.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var background = this.background;
                if (this._visual.style.background != background)
                    this._visual.style.background = background;
                if (this._children != null)
                    this._children.forEach(function (child) { return child.layout(); });
            };
            Object.defineProperty(Panel.prototype, "background", {
                get: function () {
                    return this.getValue(Panel.backgroundProperty);
                },
                set: function (value) {
                    this.setValue(Panel.backgroundProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Panel;
        }(layouts.FrameworkElement));
        Panel.typeName = "layouts.controls.Panel";
        Panel.backgroundProperty = layouts.DepObject.registerProperty(Panel.typeName, "Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.Panel = Panel;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Canvas.prototype, "typeName", {
                get: function () {
                    return Canvas.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Canvas.prototype.measureOverride = function (constraint) {
                var childConstraint = new layouts.Size(Infinity, Infinity);
                this.children.forEach(function (child) {
                    child.measure(childConstraint);
                });
                return new layouts.Size();
            };
            Canvas.prototype.arrangeOverride = function (finalSize) {
                this.children.forEach(function (child) {
                    var x = 0;
                    var y = 0;
                    var left = Canvas.getLeft(child);
                    if (!isNaN(left)) {
                        x = left;
                    }
                    else {
                        var right = Canvas.getRight(child);
                        if (!isNaN(right)) {
                            x = finalSize.width - child.desiredSize.width - right;
                        }
                    }
                    var top = Canvas.getTop(child);
                    if (!isNaN(top)) {
                        y = top;
                    }
                    else {
                        var bottom = Canvas.getBottom(child);
                        if (!isNaN(bottom)) {
                            y = finalSize.height - child.desiredSize.height - bottom;
                        }
                    }
                    child.arrange(new layouts.Rect(x, y, child.desiredSize.width, child.desiredSize.height));
                });
                return finalSize;
            };
            Canvas.getLeft = function (target) {
                return target.getValue(Canvas.leftProperty);
            };
            Canvas.setLeft = function (target, value) {
                target.setValue(Canvas.leftProperty, value);
            };
            Canvas.getTop = function (target) {
                return target.getValue(Canvas.topProperty);
            };
            Canvas.setTop = function (target, value) {
                target.setValue(Canvas.topProperty, value);
            };
            Canvas.getRight = function (target) {
                return target.getValue(Canvas.rightProperty);
            };
            Canvas.setRight = function (target, value) {
                target.setValue(Canvas.rightProperty, value);
            };
            Canvas.getBottom = function (target) {
                return target.getValue(Canvas.bottomProperty);
            };
            Canvas.setBottom = function (target, value) {
                target.setValue(Canvas.bottomProperty, value);
            };
            return Canvas;
        }(controls.Panel));
        Canvas.typeName = "layouts.controls.Canvas";
        Canvas.leftProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Left", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        Canvas.topProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Top", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        Canvas.rightProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Right", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        Canvas.bottomProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Bottom", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        controls.Canvas = Canvas;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var CheckBox = (function (_super) {
            __extends(CheckBox, _super);
            function CheckBox() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(CheckBox.prototype, "typeName", {
                get: function () {
                    return CheckBox.typeName;
                },
                enumerable: true,
                configurable: true
            });
            CheckBox.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._pElementInput = document.createElement("input");
                this._pElementInput.type = this.type;
                this._pElementInput.checked = this.isChecked;
                this._pElementInput.onclick = function (ev) { return _this.onCheckChanged(); };
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            CheckBox.prototype.onCheckChanged = function () {
                this.isChecked = this._pElementInput.checked;
            };
            CheckBox.prototype.measureOverride = function (constraint) {
                var pElement = this._pElementInput;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.offsetWidth, pElement.offsetHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            CheckBox.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == CheckBox.nameProperty) {
                    var pElement = this._pElementInput;
                    if (pElement != null) {
                        this._pElementInput.name = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == CheckBox.typeProperty) {
                    var pElement = this._pElementInput;
                    if (pElement != null) {
                        this._pElementInput.type = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == CheckBox.isCheckedProperty) {
                    var pElement = this._pElementInput;
                    if (pElement != null) {
                        this._pElementInput.checked = value;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(CheckBox.prototype, "isChecked", {
                get: function () {
                    return this.getValue(CheckBox.isCheckedProperty);
                },
                set: function (value) {
                    this.setValue(CheckBox.isCheckedProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "name", {
                get: function () {
                    return this.getValue(CheckBox.nameProperty);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "placeholder", {
                set: function (value) {
                    this.setValue(CheckBox.nameProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "type", {
                get: function () {
                    return this.getValue(CheckBox.typeProperty);
                },
                set: function (value) {
                    this.setValue(CheckBox.typeProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return CheckBox;
        }(layouts.FrameworkElement));
        CheckBox.typeName = "layouts.controls.CheckBox";
        CheckBox.isCheckedProperty = layouts.DepObject.registerProperty(CheckBox.typeName, "IsChecked", false, layouts.FrameworkPropertyMetadataOptions.None);
        CheckBox.nameProperty = layouts.DepObject.registerProperty(CheckBox.typeName, "Name", "", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        CheckBox.typeProperty = layouts.DepObject.registerProperty(CheckBox.typeName, "Type", "checkbox", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.CheckBox = CheckBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ComboBox = (function (_super) {
            __extends(ComboBox, _super);
            function ComboBox() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ComboBox.prototype, "typeName", {
                get: function () {
                    return ComboBox.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ComboBox.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._selectElement = document.createElement("select");
                this._selectElement.onchange = function (ev) { return _this.onSelectionChanged(); };
                this.setupItems();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ComboBox.prototype.onSelectionChanged = function () {
                if (this._selectElement.selectedIndex == -1) {
                    this.selectItem(null);
                }
                else if (this._elements != null) {
                    this.selectItem(this._elements[this._selectElement.selectedIndex]);
                }
            };
            ComboBox.prototype.arrangeOverride = function (finalSize) {
                this._visual.style.width = finalSize.width + "px";
                this._visual.style.height = finalSize.height + "px";
                return finalSize;
            };
            ComboBox.prototype.selectItem = function (item) {
                this.selectedItem = item;
                if (this.selectMember != null)
                    this.selectedValue = item[this.selectMember];
            };
            ComboBox.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                var _this = this;
                if (property == ComboBox.itemsSourceProperty) {
                    if (oldValue != null && oldValue["offChangeNotify"] != null) {
                        var oldItmesSource = oldValue;
                        oldItmesSource.offChangeNotify(this);
                    }
                    this.setupItems();
                    if (value != null && value["onChangeNotify"] != null) {
                        var newItemsSource = value;
                        newItemsSource.onChangeNotify(this);
                    }
                }
                else if (property == ComboBox.selectedItemProperty) {
                    if (this._selectElement != null && this._elements != null)
                        this._selectElement.selectedIndex = value == null ? -1 : this._elements.indexOf(value);
                }
                else if (property == ComboBox.selectedValueProperty) {
                    if (this._selectElement != null && this.selectMember != null && this._elements != null)
                        this.selectedItem = this._elements.firstOrDefault(function (_) { return _[_this.selectMember] == value; }, null);
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            ComboBox.prototype.setupItems = function () {
                var _this = this;
                var selectElement = this._selectElement;
                if (selectElement == null)
                    return;
                while (selectElement.children.length > 0)
                    selectElement.removeChild(selectElement.firstElementChild);
                var displayMember = this.displayMember;
                var itemsSource = this.itemsSource;
                if (itemsSource != null) {
                    var elements = null;
                    if (Object.prototype.toString.call(itemsSource) == '[object Array]')
                        elements = itemsSource;
                    else
                        elements = itemsSource["elements"];
                    if (elements == null)
                        throw new Error("Unable to get list of elements from itemsSource");
                    elements.forEach(function (el) {
                        var option = document.createElement("option");
                        option.innerHTML = (displayMember != null) ? el[displayMember] : el;
                        selectElement.appendChild(option);
                    });
                    this._elements = elements;
                    var selectedItem = this.selectedItem;
                    if (this.selectMember != null) {
                        var selectedValue = this.selectedValue;
                        selectedItem = this._elements.firstOrDefault(function (_) { return _[_this.selectMember] == selectedValue; }, null);
                    }
                    this._selectElement.selectedIndex = selectedItem == null ? -1 : this._elements.indexOf(selectedItem);
                }
                this.invalidateMeasure();
            };
            ComboBox.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                var _this = this;
                var selectElement = this._selectElement;
                if (selectElement == null)
                    return;
                var displayMember = this.displayMember;
                if (collection == this.itemsSource) {
                    added.forEach(function (item) {
                        var option = document.createElement("option");
                        option.innerHTML = (displayMember != null) ? item[displayMember] : item;
                        selectElement.appendChild(option);
                    });
                    removed.forEach(function (item) {
                        var elementToRemove = selectElement.children[startRemoveIndex];
                        var noneWasSelected = selectElement.selectedIndex == -1;
                        selectElement.removeChild(elementToRemove);
                        if (noneWasSelected)
                            selectElement.selectedIndex = -1;
                        if (item == _this.selectedItem)
                            _this.selectedItem = _this.selectedValue = null;
                        startRemoveIndex++;
                    });
                }
                this.invalidateMeasure();
            };
            Object.defineProperty(ComboBox.prototype, "itemsSource", {
                get: function () {
                    return this.getValue(ComboBox.itemsSourceProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.itemsSourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedItem", {
                get: function () {
                    return this.getValue(ComboBox.selectedItemProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.selectedItemProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "displayMember", {
                get: function () {
                    return this.getValue(ComboBox.displayMemberProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.displayMemberProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedValue", {
                get: function () {
                    return this.getValue(ComboBox.selectedValueProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.selectedValueProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectMember", {
                get: function () {
                    return this.getValue(ComboBox.selectMemberProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.selectMemberProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return ComboBox;
        }(layouts.FrameworkElement));
        ComboBox.typeName = "layouts.controls.ComboBox";
        ComboBox.itemsSourceProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "ItemsSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.selectedItemProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectedItem", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.displayMemberProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "DisplayMember", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.selectedValueProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectedValue", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.selectMemberProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectMember", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ComboBox = ComboBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ContentTemplate = (function (_super) {
            __extends(ContentTemplate, _super);
            function ContentTemplate() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ContentTemplate.prototype, "typeName", {
                get: function () {
                    return ContentTemplate.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ContentTemplate.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            ContentTemplate.prototype.setXamlLoader = function (loader) {
                this._xamlLoader = loader;
            };
            ContentTemplate.prototype.setupChild = function () {
                if (this._container == null)
                    return;
                var content = this.content;
                var child = this._child;
                if (content == null &&
                    child == null)
                    return;
                if (content != null &&
                    child == null) {
                    if (this._innerXaml != null &&
                        this._xamlLoader != null) {
                        this._child = child = this._xamlLoader.Parse(this._innerXaml);
                    }
                }
                if (content != null &&
                    child != null) {
                    child.setValue(layouts.FrameworkElement.dataContextProperty, content);
                    child.parent = this;
                    child.attachVisual(this._container);
                }
                if (content == null &&
                    child != null) {
                    if (child.parent == this) {
                        child.parent = null;
                        child.attachVisual(null);
                    }
                }
            };
            ContentTemplate.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupChild();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ContentTemplate.prototype.measureOverride = function (constraint) {
                var child = this._child;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            ContentTemplate.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            ContentTemplate.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._child;
                if (child != null)
                    child.layout(this.visualOffset);
            };
            Object.defineProperty(ContentTemplate.prototype, "content", {
                get: function () {
                    return this.getValue(ContentTemplate.contentProperty);
                },
                set: function (value) {
                    this.setValue(ContentTemplate.contentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            ContentTemplate.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == ContentTemplate.contentProperty) {
                    this.setupChild();
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            return ContentTemplate;
        }(layouts.FrameworkElement));
        ContentTemplate.typeName = "layouts.controls.ContentTemplate";
        ContentTemplate.contentProperty = layouts.DepObject.registerProperty(ContentTemplate.typeName, "Content", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ContentTemplate = ContentTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ControlTemplate = (function (_super) {
            __extends(ControlTemplate, _super);
            function ControlTemplate() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ControlTemplate.prototype, "typeName", {
                get: function () {
                    return ControlTemplate.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ControlTemplate.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                var child = this.content;
                if (child != null) {
                    child.parent = this;
                    child.attachVisual(this._container);
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ControlTemplate.prototype.measureOverride = function (constraint) {
                var child = this.content;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            ControlTemplate.prototype.arrangeOverride = function (finalSize) {
                var child = this.content;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            ControlTemplate.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this.content;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            ControlTemplate.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == ControlTemplate.contentProperty) {
                    var oldChild = oldValue;
                    if (oldChild != null && oldChild.parent == this) {
                        oldChild.attachVisual(null);
                        oldChild.parent = null;
                    }
                    var newChild = value;
                    if (newChild != null) {
                        if (this._container != null)
                            newChild.attachVisual(this._container);
                        newChild.parent = this;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(ControlTemplate.prototype, "content", {
                get: function () {
                    return this.getValue(ControlTemplate.contentProperty);
                },
                set: function (value) {
                    this.setValue(ControlTemplate.contentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return ControlTemplate;
        }(layouts.FrameworkElement));
        ControlTemplate.typeName = "layouts.controls.ControlTemplate";
        ControlTemplate.contentProperty = layouts.DepObject.registerProperty(ControlTemplate.typeName, "Content", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ControlTemplate = ControlTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ControlTemplateSelector = (function (_super) {
            __extends(ControlTemplateSelector, _super);
            function ControlTemplateSelector() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ControlTemplateSelector.prototype, "typeName", {
                get: function () {
                    return ControlTemplateSelector.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ControlTemplateSelector.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupItem();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ControlTemplateSelector.prototype.setupItem = function () {
                if (this._container == null)
                    return;
                if (this._element != null) {
                    this._element.attachVisual(null);
                    this._element.parent = null;
                }
                if (this._templates == null ||
                    this._templates.count == 0)
                    return;
                var contentSource = this.contentSource;
                if (contentSource != null) {
                    var templateForItem = controls.DataTemplate.getTemplateForItem(this._templates.toArray(), contentSource);
                    if (templateForItem == null) {
                        throw new Error("Unable to find a valid template for item");
                    }
                    this._element = templateForItem.createElement();
                    this._element.setValue(layouts.FrameworkElement.dataContextProperty, contentSource);
                }
                if (this._element != null) {
                    this._element.attachVisual(this._container);
                    this._element.parent = this;
                }
                this.invalidateMeasure();
            };
            ControlTemplateSelector.prototype.measureOverride = function (constraint) {
                var child = this._element;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            ControlTemplateSelector.prototype.arrangeOverride = function (finalSize) {
                var child = this._element;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            ControlTemplateSelector.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._element;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            ControlTemplateSelector.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == ControlTemplateSelector.contentSourceProperty) {
                    this.setupItem();
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(ControlTemplateSelector.prototype, "contentSource", {
                get: function () {
                    return this.getValue(ControlTemplateSelector.contentSourceProperty);
                },
                set: function (value) {
                    this.setValue(ControlTemplateSelector.contentSourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ControlTemplateSelector.prototype, "templates", {
                get: function () {
                    return this._templates;
                },
                set: function (value) {
                    if (value == this._templates)
                        return;
                    if (this._templates != null) {
                        this._templates.offChangeNotify(this);
                    }
                    this._templates = value;
                    if (this._templates != null) {
                        this._templates.forEach(function (el) {
                        });
                        this._templates.onChangeNotify(this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            ControlTemplateSelector.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                if (collection == this._templates) {
                    this.setupItem();
                }
                this.invalidateMeasure();
            };
            return ControlTemplateSelector;
        }(layouts.FrameworkElement));
        ControlTemplateSelector.typeName = "layouts.controls.ControlTemplateSelector";
        ControlTemplateSelector.contentSourceProperty = layouts.DepObject.registerProperty(ControlTemplateSelector.typeName, "ContentSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ControlTemplateSelector = ControlTemplateSelector;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var DataTemplate = (function (_super) {
            __extends(DataTemplate, _super);
            function DataTemplate() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(DataTemplate.prototype, "typeName", {
                get: function () {
                    return DataTemplate.typeName;
                },
                enumerable: true,
                configurable: true
            });
            DataTemplate.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            DataTemplate.prototype.setXamlLoader = function (loader) {
                this._xamlLoader = loader;
            };
            DataTemplate.prototype.createElement = function () {
                var reader = this._xamlLoader;
                if (reader == null)
                    reader = new layouts.XamlReader();
                return reader.Parse(this._innerXaml);
            };
            DataTemplate.getTemplateForItem = function (templates, item, name) {
                if (name === void 0) { name = null; }
                if (templates == null ||
                    templates.length == 0)
                    return null;
                var foundTemplate = templates.firstOrDefault(function (template) {
                    if (name != null &&
                        template.name != null &&
                        template.name.toLowerCase() == name.toLowerCase())
                        return true;
                    if (template.targetType == null)
                        return false;
                    var itemForTemplate = item;
                    if (template.targetMember != null &&
                        template.targetMember != "")
                        itemForTemplate = itemForTemplate[template.targetMember];
                    var typeName = typeof itemForTemplate;
                    if (layouts.Ext.hasProperty(itemForTemplate, "typeName"))
                        typeName = itemForTemplate["typeName"];
                    else {
                        if (itemForTemplate instanceof Date)
                            typeName = "date";
                    }
                    if (typeName != null &&
                        template.targetType != null &&
                        template.targetType.toLowerCase() == typeName.toLowerCase())
                        return true;
                    return false;
                }, null);
                if (foundTemplate != null)
                    return foundTemplate;
                return templates.firstOrDefault(function (dt) { return dt.targetType == null; }, null);
            };
            DataTemplate.getTemplateForMedia = function (templates) {
                if (templates == null ||
                    templates.length == 0)
                    return null;
                var foundTemplate = templates.firstOrDefault(function (template) {
                    if (template.media == null ||
                        template.media.trim().length == 0) {
                        return true;
                    }
                    return window.matchMedia(template.media).matches;
                }, null);
                if (foundTemplate != null)
                    return foundTemplate;
                return templates.firstOrDefault(function (dt) { return dt.targetType == null; }, null);
            };
            Object.defineProperty(DataTemplate.prototype, "targetType", {
                get: function () {
                    return this.getValue(DataTemplate.targetTypeProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.targetTypeProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTemplate.prototype, "targetMember", {
                get: function () {
                    return this.getValue(DataTemplate.targetMemberProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.targetMemberProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTemplate.prototype, "media", {
                get: function () {
                    return this.getValue(DataTemplate.mediaProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.mediaProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTemplate.prototype, "name", {
                get: function () {
                    return this.getValue(DataTemplate.nameProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.nameProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return DataTemplate;
        }(layouts.DepObject));
        DataTemplate.typeName = "layouts.controls.DataTemplate";
        DataTemplate.targetTypeProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "TargetType", null);
        DataTemplate.targetMemberProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "TargetMember", null);
        DataTemplate.mediaProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "Media", null);
        DataTemplate.nameProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "Name", null);
        controls.DataTemplate = DataTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Frame = (function (_super) {
            __extends(Frame, _super);
            function Frame() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Frame.prototype, "typeName", {
                get: function () {
                    return Frame.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Frame.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._frameElement = document.createElement("frame");
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Frame.prototype.measureOverride = function (constraint) {
                var src = this.Source;
                var mySize = new layouts.Size();
                var pElement = this._frameElement;
                var srcChanged = (pElement.src != src);
                if (isFinite(constraint.width))
                    pElement.style.maxWidth = constraint.width + "px";
                if (isFinite(constraint.height))
                    pElement.style.maxHeight = constraint.height + "px";
                pElement.style.width = "auto";
                pElement.style.height = "auto";
                if (srcChanged) {
                    pElement.src = src;
                }
                mySize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                if (srcChanged && this.renderSize != null) {
                    pElement.style.width = this.renderSize.width.toString() + "px";
                    pElement.style.height = this.renderSize.height.toString() + "px";
                }
                return mySize;
            };
            Object.defineProperty(Frame.prototype, "Source", {
                get: function () {
                    return this.getValue(Frame.sourceProperty);
                },
                set: function (value) {
                    this.setValue(Frame.sourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Frame;
        }(layouts.FrameworkElement));
        Frame.typeName = "layouts.controls.Frame";
        Frame.sourceProperty = layouts.DepObject.registerProperty(Frame.typeName, "Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.Frame = Frame;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var GridUnitType;
        (function (GridUnitType) {
            GridUnitType[GridUnitType["Auto"] = 0] = "Auto";
            GridUnitType[GridUnitType["Pixel"] = 1] = "Pixel";
            GridUnitType[GridUnitType["Star"] = 2] = "Star";
        })(GridUnitType = controls.GridUnitType || (controls.GridUnitType = {}));
        var GridLength = (function () {
            function GridLength(value, type) {
                if (type === void 0) { type = GridUnitType.Pixel; }
                if (value.isCloseTo(0))
                    value = 0;
                this._value = value;
                this._type = type;
            }
            GridLength.parseString = function (value) {
                value = value.trim();
                var tokens = value.split(" ");
                return tokens.map(function (token) {
                    token = token.trim();
                    if (token.length == 0)
                        return;
                    if (token[0] == '[') {
                        if (token.length < 3 || token[token.length - 1] != ']')
                            throw new Error("GridLength definition error");
                        var subTokens = token.substr(1, token.length - 2).split(",");
                        if (subTokens.length == 1)
                            return {
                                length: GridLength.fromString(subTokens[0])
                            };
                        else if (subTokens.length == 3) {
                            var minSubToken = subTokens[0].trim();
                            var min = minSubToken.length == 0 ? 0 : parseFloat(minSubToken);
                            var maxSubToken = subTokens[2].trim();
                            var max = maxSubToken.length == 0 ? +Infinity : parseFloat(maxSubToken);
                            return {
                                length: GridLength.fromString(subTokens[1]),
                                min: min,
                                max: max
                            };
                        }
                        else
                            throw new Error("GridLength definition error");
                    }
                    else {
                        return {
                            length: GridLength.fromString(token)
                        };
                    }
                });
            };
            GridLength.fromString = function (value) {
                if (value == "Auto")
                    return new GridLength(1, GridUnitType.Auto);
                if (value.substr(value.length - 1, 1) == "*") {
                    var starLen = value.length == 1 ? 1 : parseFloat(value.substr(0, value.length - 1));
                    return new GridLength(starLen, GridUnitType.Star);
                }
                return new GridLength(parseFloat(value), GridUnitType.Pixel);
            };
            Object.defineProperty(GridLength.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "isAuto", {
                get: function () {
                    return this._type == GridUnitType.Auto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "isFixed", {
                get: function () {
                    return this._type == GridUnitType.Pixel;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "isStar", {
                get: function () {
                    return this._type == GridUnitType.Star;
                },
                enumerable: true,
                configurable: true
            });
            return GridLength;
        }());
        controls.GridLength = GridLength;
        var GridRow = (function () {
            function GridRow(height, minHeight, maxHeight) {
                if (height === void 0) { height = new GridLength(1, GridUnitType.Star); }
                if (minHeight === void 0) { minHeight = 0; }
                if (maxHeight === void 0) { maxHeight = +Infinity; }
                this.height = height;
                this.minHeight = minHeight;
                this.maxHeight = maxHeight;
            }
            return GridRow;
        }());
        controls.GridRow = GridRow;
        var GridColumn = (function () {
            function GridColumn(width, minWidth, maxWidth) {
                if (width === void 0) { width = new GridLength(1, GridUnitType.Star); }
                if (minWidth === void 0) { minWidth = 0; }
                if (maxWidth === void 0) { maxWidth = +Infinity; }
                this.width = width;
                this.minWidth = minWidth;
                this.maxWidth = maxWidth;
            }
            return GridColumn;
        }());
        controls.GridColumn = GridColumn;
        var RowDef = (function () {
            function RowDef(row, index, vSizeToContent) {
                this.row = row;
                this.index = index;
                this.availHeight = Infinity;
                this._desHeight = 0;
                this._finalHeight = 0;
                this.elements = [];
                this._isAuto = this.row.height.isAuto || (vSizeToContent && this.row.height.isStar);
                this._isStar = this.row.height.isStar && !vSizeToContent;
                this._isFixed = this.row.height.isFixed;
            }
            Object.defineProperty(RowDef.prototype, "desHeight", {
                get: function () {
                    return this._desHeight;
                },
                set: function (newValue) {
                    this._desHeight = newValue.minMax(this.row.minHeight, this.row.maxHeight);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "finalHeight", {
                get: function () {
                    return this._finalHeight;
                },
                set: function (newValue) {
                    this._finalHeight = newValue.minMax(this.row.minHeight, this.row.maxHeight);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "isAuto", {
                get: function () {
                    return this._isAuto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "isStar", {
                get: function () {
                    return this._isStar;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "isFixed", {
                get: function () {
                    return this._isFixed;
                },
                enumerable: true,
                configurable: true
            });
            return RowDef;
        }());
        var ColumnDef = (function () {
            function ColumnDef(column, index, hSizeToContent) {
                this.column = column;
                this.index = index;
                this.availWidth = Infinity;
                this._desWidth = 0;
                this._finalWidth = 0;
                this.elements = [];
                this._isAuto = this.column.width.isAuto || (hSizeToContent && this.column.width.isStar);
                this._isStar = this.column.width.isStar && !hSizeToContent;
                this._isFixed = this.column.width.isFixed;
            }
            Object.defineProperty(ColumnDef.prototype, "desWidth", {
                get: function () {
                    return this._desWidth;
                },
                set: function (newValue) {
                    this._desWidth = newValue.minMax(this.column.minWidth, this.column.maxWidth);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "finalWidth", {
                get: function () {
                    return this._finalWidth;
                },
                set: function (newValue) {
                    this._finalWidth = newValue.minMax(this.column.minWidth, this.column.maxWidth);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "isAuto", {
                get: function () {
                    return this._isAuto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "isStar", {
                get: function () {
                    return this._isStar;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "isFixed", {
                get: function () {
                    return this._isFixed;
                },
                enumerable: true,
                configurable: true
            });
            return ColumnDef;
        }());
        var ElementDef = (function () {
            function ElementDef(element, row, column, rowSpan, columnSpan) {
                this.element = element;
                this.row = row;
                this.column = column;
                this.rowSpan = rowSpan;
                this.columnSpan = columnSpan;
                this.desWidth = NaN;
                this.desHeight = NaN;
                this.cellTopOffset = 0;
                this.cellLeftOffset = 0;
                this._availWidth = new Array(columnSpan);
                for (var i = 0; i < this._availWidth.length; i++)
                    this._availWidth[i] = Infinity;
                this._availHeight = new Array(rowSpan);
                for (var i = 0; i < this._availHeight.length; i++)
                    this._availHeight[i] = Infinity;
            }
            ElementDef.prototype.getAvailWidth = function (column) {
                return this._availWidth[column - this.column];
            };
            ElementDef.prototype.getAllAvailWidth = function () {
                var sum = 0;
                for (var i = 0; i < this._availWidth.length; i++) {
                    if (!isFinite(this._availWidth[i]))
                        return Infinity;
                    sum += this._availWidth[i];
                }
                return sum;
            };
            ElementDef.prototype.setAvailWidth = function (column, value) {
                this._availWidth[column - this.column] = value;
            };
            ElementDef.prototype.getAvailHeight = function (row) {
                return this._availHeight[row - this.row];
            };
            ElementDef.prototype.getAllAvailHeight = function () {
                var sum = 0;
                for (var i = 0; i < this._availHeight.length; i++) {
                    if (!isFinite(this._availHeight[i]))
                        return Infinity;
                    sum += this._availHeight[i];
                }
                return sum;
            };
            ElementDef.prototype.setAvailHeight = function (row, value) {
                this._availHeight[row - this.row] = value;
            };
            return ElementDef;
        }());
        var Grid = (function (_super) {
            __extends(Grid, _super);
            function Grid() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Grid.prototype, "typeName", {
                get: function () {
                    return Grid.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.measureOverride = function (constraint) {
                var _this = this;
                var desideredSize = new layouts.Size();
                var hSizeToContent = !isFinite(constraint.width);
                var vSizeToContent = !isFinite(constraint.height);
                var childrenCount = this.children == null ? 0 : this.children.count;
                var rows = this.getRows();
                var columns = this.getColumns();
                this._rowDefs = new Array(Math.max(rows.count, 1));
                this._columnDefs = new Array(Math.max(this.columns.count, 1));
                this._elementDefs = new Array(childrenCount);
                if (rows.count > 0)
                    rows.forEach(function (row, i) { return _this._rowDefs[i] = new RowDef(row, i, vSizeToContent); });
                else
                    this._rowDefs[0] = new RowDef(new GridRow(new GridLength(1, GridUnitType.Star)), 0, vSizeToContent);
                if (columns.count > 0)
                    columns.forEach(function (column, i) { return _this._columnDefs[i] = new ColumnDef(column, i, hSizeToContent); });
                else
                    this._columnDefs[0] = new ColumnDef(new GridColumn(new GridLength(1, GridUnitType.Star)), 0, hSizeToContent);
                for (var iElement = 0; iElement < childrenCount; iElement++) {
                    var child = this.children.at(iElement);
                    var elRow = Grid.getRow(child).minMax(0, this._rowDefs.length - 1);
                    var elColumn = Grid.getColumn(child).minMax(0, this._columnDefs.length - 1);
                    var elRowSpan = Grid.getRowSpan(child).minMax(1, this._rowDefs.length - elRow);
                    var elColumnSpan = Grid.getColumnSpan(child).minMax(1, this._columnDefs.length - elColumn);
                    this._elementDefs[iElement] = new ElementDef(child, elRow, elColumn, elRowSpan, elColumnSpan);
                    if (elRowSpan == 1) {
                        for (var row = elRow; row < elRow + elRowSpan; row++)
                            this._rowDefs[row].elements.push(this._elementDefs[iElement]);
                    }
                    if (elColumnSpan == 1) {
                        for (var col = elColumn; col < elColumn + elColumnSpan; col++)
                            this._columnDefs[col].elements.push(this._elementDefs[iElement]);
                    }
                }
                for (var iRow = 0; iRow < this._rowDefs.length; iRow++) {
                    var rowDef = this._rowDefs[iRow];
                    var elements = rowDef.elements;
                    if (rowDef.isAuto) {
                        elements.forEach(function (el) { return el.setAvailHeight(iRow, Infinity); });
                    }
                    else if (rowDef.isFixed) {
                        rowDef.desHeight = rowDef.row.height.value;
                        elements.forEach(function (el) { return el.setAvailHeight(iRow, rowDef.desHeight); });
                    }
                    else {
                        elements.forEach(function (el) { return el.measuredWidthFirstPass = true; });
                    }
                }
                for (var iColumn = 0; iColumn < this._columnDefs.length; iColumn++) {
                    var columnDef = this._columnDefs[iColumn];
                    var elements = columnDef.elements;
                    if (columnDef.isAuto) {
                        elements.forEach(function (el) { return el.setAvailWidth(iColumn, Infinity); });
                    }
                    else if (columnDef.isFixed) {
                        columnDef.desWidth = columnDef.column.width.value;
                        elements.forEach(function (el) { return el.setAvailWidth(iColumn, columnDef.desWidth); });
                    }
                    else {
                        elements.forEach(function (el) { return el.measuredHeightFirstPass = true; });
                    }
                }
                this._elementDefs.forEach(function (el) {
                    if (!el.measuredHeightFirstPass ||
                        !el.measuredWidthFirstPass) {
                        el.element.measure(new layouts.Size(el.getAllAvailWidth(), el.getAllAvailHeight()));
                        if (isNaN(el.desWidth))
                            el.desWidth = el.element.desiredSize.width;
                        if (isNaN(el.desHeight))
                            el.desHeight = el.element.desiredSize.height;
                    }
                    el.measuredWidthFirstPass = el.measuredHeightFirstPass = true;
                });
                this._rowDefs.forEach(function (rowDef) {
                    if (!rowDef.isStar)
                        rowDef.elements.forEach(function (el) { return rowDef.desHeight = Math.max(rowDef.desHeight, el.element.desiredSize.height); });
                });
                this._columnDefs.forEach(function (columnDef) {
                    if (!columnDef.isStar)
                        columnDef.elements.forEach(function (el) { return columnDef.desWidth = Math.max(columnDef.desWidth, el.element.desiredSize.width); });
                });
                var elementToMeasure = [];
                var notStarRowsHeight = 0;
                this._rowDefs.forEach(function (r) { return notStarRowsHeight += r.desHeight; });
                var sumRowStars = 0;
                this._rowDefs.forEach(function (r) { if (r.isStar)
                    sumRowStars += r.row.height.value; });
                var vRowMultiplier = (constraint.height - notStarRowsHeight) / sumRowStars;
                this._rowDefs.forEach(function (rowDef) {
                    if (!rowDef.isStar)
                        return;
                    var elements = rowDef.elements;
                    if (!vSizeToContent) {
                        var availHeight = vRowMultiplier * rowDef.row.height.value;
                        rowDef.desHeight = availHeight;
                        elements.forEach(function (el) { el.setAvailHeight(rowDef.index, availHeight); el.measuredHeightFirstPass = false; });
                    }
                    elementToMeasure.push.apply(elementToMeasure, elements);
                });
                var notStarColumnsHeight = 0;
                this._columnDefs.forEach(function (c) { return notStarColumnsHeight += c.desWidth; });
                var sumColumnStars = 0;
                this._columnDefs.forEach(function (c) { if (c.isStar)
                    sumColumnStars += c.column.width.value; });
                var vColumnMultiplier = (constraint.width - notStarColumnsHeight) / sumColumnStars;
                this._columnDefs.forEach(function (columnDef) {
                    if (!columnDef.isStar)
                        return;
                    var elements = columnDef.elements;
                    if (!hSizeToContent) {
                        var availWidth = vColumnMultiplier * columnDef.column.width.value;
                        columnDef.desWidth = availWidth;
                        elements.forEach(function (el) { el.setAvailWidth(columnDef.index, availWidth); el.measuredWidthFirstPass = false; });
                    }
                    elementToMeasure.push.apply(elementToMeasure, elements);
                });
                elementToMeasure.forEach(function (e) {
                    if (!e.measuredHeightFirstPass ||
                        !e.measuredWidthFirstPass) {
                        e.element.measure(new layouts.Size(e.getAllAvailWidth(), e.getAllAvailHeight()));
                        e.desWidth = e.element.desiredSize.width;
                        e.desHeight = e.element.desiredSize.height;
                        e.measuredWidthFirstPass = true;
                        e.measuredHeightFirstPass = true;
                    }
                });
                for (var iElement = 0; iElement < this._elementDefs.length; iElement++) {
                    var elementDef = this._elementDefs[iElement];
                    if (elementDef.rowSpan > 1) {
                        if (this._rowDefs
                            .slice(elementDef.row, elementDef.row + elementDef.rowSpan)
                            .every(function (v, i, a) { return v.isAuto || v.isFixed; })) {
                            var concatHeight = 0;
                            this._rowDefs.slice(elementDef.row, elementDef.row + elementDef.rowSpan).forEach(function (el) { return concatHeight += el.desHeight; });
                            if (concatHeight < elementDef.desHeight) {
                                var diff = elementDef.desHeight - concatHeight;
                                var autoRows = this._rowDefs.filter(function (r) { return r.isAuto; });
                                if (autoRows.length > 0) {
                                    autoRows.forEach(function (c) { return c.desHeight += diff / autoRows.length; });
                                }
                                else {
                                    var starRows = this._rowDefs.filter(function (r) { return r.isStar; });
                                    if (starRows.length > 0) {
                                        starRows.forEach(function (c) { return c.desHeight += diff / autoColumns.length; });
                                    }
                                }
                            }
                            else if (concatHeight > elementDef.desHeight) {
                                elementDef.cellTopOffset = (concatHeight - elementDef.desHeight) / 2;
                            }
                        }
                    }
                    if (elementDef.columnSpan > 1) {
                        if (this._columnDefs
                            .slice(elementDef.column, elementDef.column + elementDef.columnSpan)
                            .every(function (v, i, a) { return v.isAuto || v.isFixed; })) {
                            var concatWidth = 0;
                            this._columnDefs.slice(elementDef.column, elementDef.column + elementDef.columnSpan).forEach(function (el) { return concatWidth += el.desWidth; });
                            if (concatWidth < elementDef.desWidth) {
                                var diff = elementDef.desWidth - concatWidth;
                                var autoColumns = this._columnDefs.filter(function (c) { return c.isAuto; });
                                if (autoColumns.length > 0) {
                                    autoColumns.forEach(function (c) { return c.desWidth += diff / autoColumns.length; });
                                }
                                else {
                                    var starColumns = this._columnDefs.filter(function (c) { return c.isStar; });
                                    if (starColumns.length > 0) {
                                        starColumns.forEach(function (c) { return c.desWidth += diff / autoColumns.length; });
                                    }
                                }
                            }
                            else if (concatWidth > elementDef.desWidth) {
                                elementDef.cellLeftOffset = (concatWidth - elementDef.desWidth) / 2;
                            }
                        }
                    }
                }
                this._rowDefs.forEach(function (r) { return desideredSize.height += r.desHeight; });
                this._columnDefs.forEach(function (c) { return desideredSize.width += c.desWidth; });
                this._lastDesiredSize = desideredSize;
                return desideredSize;
            };
            Grid.prototype.arrangeOverride = function (finalSize) {
                var _this = this;
                var xDiff = finalSize.width - this._lastDesiredSize.width;
                var yDiff = finalSize.height - this._lastDesiredSize.height;
                var starRowCount = 0;
                this._rowDefs.forEach(function (rd) {
                    if (rd.row.height.isStar)
                        starRowCount++;
                });
                var starColumnCount = 0;
                this._columnDefs.forEach(function (cd) {
                    if (cd.column.width.isStar)
                        starColumnCount++;
                });
                this._rowDefs.forEach(function (rd) {
                    if (rd.row.height.isStar)
                        rd.finalHeight = rd.desHeight + yDiff / starRowCount;
                    else
                        rd.finalHeight = rd.desHeight;
                });
                this._columnDefs.forEach(function (cd) {
                    if (cd.column.width.isStar)
                        cd.finalWidth = cd.desWidth + xDiff / starColumnCount;
                    else
                        cd.finalWidth = cd.desWidth;
                });
                this._elementDefs.forEach(function (el) {
                    var finalLeft = 0;
                    _this._columnDefs.slice(0, el.column).forEach(function (c) { return finalLeft += c.finalWidth; });
                    var finalWidth = 0;
                    _this._columnDefs.slice(el.column, el.column + el.columnSpan).forEach(function (c) { return finalWidth += c.finalWidth; });
                    finalWidth -= (el.cellLeftOffset * 2);
                    var finalTop = 0;
                    _this._rowDefs.slice(0, el.row).forEach(function (c) { return finalTop += c.finalHeight; });
                    var finalHeight = 0;
                    _this._rowDefs.slice(el.row, el.row + el.rowSpan).forEach(function (r) { return finalHeight += r.finalHeight; });
                    finalHeight += (el.cellTopOffset * 2);
                    el.element.arrange(new layouts.Rect(finalLeft + el.cellLeftOffset, finalTop + el.cellTopOffset, finalWidth, finalHeight));
                });
                return finalSize;
            };
            Grid.prototype.getRowFinalHeight = function (rowIndex) {
                return this._rowDefs[rowIndex].finalHeight;
            };
            Grid.prototype.getColumnFinalWidth = function (colIndex) {
                return this._columnDefs[colIndex].finalWidth;
            };
            Object.defineProperty(Grid.prototype, "rows", {
                get: function () {
                    return this.getValue(Grid.rowsProperty);
                },
                set: function (value) {
                    this.setValue(Grid.rowsProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.getRows = function () {
                var rows = this.rows;
                if (rows == null) {
                    this.rows = rows = new layouts.ObservableCollection();
                    rows.onChangeNotify(this);
                }
                return rows;
            };
            Grid.rowsFromString = function (rows) {
                var listOfRows = new Array();
                GridLength.parseString(rows).forEach(function (rowDef) {
                    listOfRows.push(new GridRow(rowDef.length, rowDef.min, rowDef.max));
                });
                return new layouts.ObservableCollection(listOfRows);
            };
            Object.defineProperty(Grid.prototype, "columns", {
                get: function () {
                    return this.getValue(Grid.columnsProperty);
                },
                set: function (value) {
                    this.setValue(Grid.columnsProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.getColumns = function () {
                var columns = this.columns;
                if (columns == null) {
                    this.columns = columns = new layouts.ObservableCollection();
                    columns.onChangeNotify(this);
                }
                return columns;
            };
            Grid.columnsFromString = function (columns) {
                var listOfColumns = new Array();
                GridLength.parseString(columns).forEach(function (columnDef) {
                    listOfColumns.push(new GridColumn(columnDef.length, columnDef.min, columnDef.max));
                });
                return new layouts.ObservableCollection(listOfColumns);
            };
            Grid.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                _super.prototype.invalidateMeasure.call(this);
            };
            Grid.getRow = function (target) {
                return target.getValue(Grid.rowProperty);
            };
            Grid.setRow = function (target, value) {
                target.setValue(Grid.rowProperty, value);
            };
            Grid.getColumn = function (target) {
                return target.getValue(Grid.columnProperty);
            };
            Grid.setColumn = function (target, value) {
                target.setValue(Grid.columnProperty, value);
            };
            Grid.fromString = function (value) {
                var intValue = parseInt(value);
                if (isNaN(intValue) ||
                    !isFinite(intValue))
                    return 0;
                return intValue;
            };
            Grid.getRowSpan = function (target) {
                return target.getValue(Grid.rowSpanProperty);
            };
            Grid.setRowSpan = function (target, value) {
                target.setValue(Grid.rowSpanProperty, value);
            };
            Grid.getColumnSpan = function (target) {
                return target.getValue(Grid.columnSpanProperty);
            };
            Grid.setColumnSpan = function (target, value) {
                target.setValue(Grid.columnSpanProperty, value);
            };
            Grid.spanFromString = function (value) {
                var intValue = parseInt(value);
                if (isNaN(intValue) ||
                    !isFinite(intValue))
                    return 1;
                return intValue;
            };
            return Grid;
        }(controls.Panel));
        Grid.typeName = "layouts.controls.Grid";
        Grid.rowsProperty = layouts.DepObject.registerProperty(Grid.typeName, "Rows", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Grid.rowsFromString(v); });
        Grid.columnsProperty = layouts.DepObject.registerProperty(Grid.typeName, "Columns", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Grid.columnsFromString(v); });
        Grid.rowProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#Row", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.fromString(v); });
        Grid.columnProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#Column", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.fromString(v); });
        Grid.rowSpanProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#RowSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.spanFromString(v); });
        Grid.columnSpanProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#ColumnSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.spanFromString(v); });
        controls.Grid = Grid;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var GridSplitter = (function (_super) {
            __extends(GridSplitter, _super);
            function GridSplitter() {
                var _this = _super.call(this) || this;
                _this._draggingCurrentPoint = new layouts.Vector();
                _this._draggingStartPoint = new layouts.Vector();
                _this._draggingVirtualOffset = new layouts.Vector();
                _this._draggingVirtualOffsetMin = new layouts.Vector();
                _this._draggingVirtualOffsetMax = new layouts.Vector();
                _this.onSplitterMouseMove = function (ev) {
                    if (ev.buttons == 0) {
                        document.removeEventListener("mousemove", _this.onSplitterMouseMove, false);
                        document.removeEventListener("mouseup", _this.onSplitterMouseUp, false);
                    }
                    else
                        _this.moveGhost(ev);
                    ev.stopPropagation();
                };
                _this.onSplitterMouseUp = function (ev) {
                    _this.moveGhost(ev);
                    _this.dragSplitter(_this._draggingCurrentPoint.x, _this._draggingCurrentPoint.y);
                    document.removeEventListener("mousemove", _this.onSplitterMouseMove, false);
                    document.removeEventListener("mouseup", _this.onSplitterMouseUp, false);
                    ev.stopPropagation();
                };
                layouts.FrameworkElement.classProperty.overrideDefaultValue(GridSplitter.typeName, "gridSplitter");
                return _this;
            }
            Object.defineProperty(GridSplitter.prototype, "typeName", {
                get: function () {
                    return GridSplitter.typeName;
                },
                enumerable: true,
                configurable: true
            });
            GridSplitter.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
                this._visual.addEventListener("mousedown", function (ev) { return _this.onSplitterMouseDown(ev); }, true);
                this._visual.tag = this;
                this._visual.onselectstart = function () { return false; };
                this.updateCursor();
            };
            GridSplitter.prototype.onSplitterMouseDown = function (ev) {
                this.initializeDrag(ev);
            };
            GridSplitter.prototype.updateCursor = function () {
                if (this._visual == null) {
                    this._visual.style.cursor = "normal";
                    return;
                }
                if (this.verticalAlignment == layouts.VerticalAlignment.Top ||
                    this.verticalAlignment == layouts.VerticalAlignment.Bottom)
                    this._visual.style.cursor = "n-resize";
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Left ||
                    this.horizontalAlignment == layouts.HorizontalAlignment.Right)
                    this._visual.style.cursor = "e-resize";
                else
                    this._visual.style.cursor = layouts.Consts.stringEmpty;
            };
            GridSplitter.prototype.initializeDrag = function (ev) {
                var parentGrid = this.parent;
                if (parentGrid == null)
                    return;
                if (this.visualOffset == null)
                    return;
                var dragging = false;
                var leftColumnWidth = 0;
                var rightColumnWidth = 0;
                var topRowHeight = 0;
                var bottomRowHeight = 0;
                if (this.verticalAlignment == layouts.VerticalAlignment.Top) {
                    var thisRowIndex = controls.Grid.getRow(this);
                    thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                    dragging = thisRowIndex > 0 && parentGrid.rows.count > 1;
                    if (dragging) {
                        topRowHeight = parentGrid.getRowFinalHeight(thisRowIndex - 1) - parentGrid.getRows().at(thisRowIndex - 1).minHeight;
                        bottomRowHeight = parentGrid.getRowFinalHeight(thisRowIndex) - parentGrid.getRows().at(thisRowIndex).minHeight;
                    }
                }
                else if (this.verticalAlignment == layouts.VerticalAlignment.Bottom) {
                    var thisRowIndex = controls.Grid.getRow(this);
                    thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                    dragging = thisRowIndex >= 0 && parentGrid.rows.count > 1;
                    if (dragging) {
                        topRowHeight = parentGrid.getRowFinalHeight(thisRowIndex) - parentGrid.getRows().at(thisRowIndex).minHeight;
                        bottomRowHeight = parentGrid.getRowFinalHeight(thisRowIndex + 1) - parentGrid.getRows().at(thisRowIndex + 1).minHeight;
                    }
                }
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Left) {
                    var thisColIndex = controls.Grid.getColumn(this);
                    thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                    dragging = thisColIndex > 0 && parentGrid.columns.count > 1;
                    if (dragging) {
                        leftColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex - 1) - parentGrid.getColumns().at(thisColIndex - 1).minWidth;
                        rightColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex) - parentGrid.getColumns().at(thisColIndex).minWidth;
                    }
                }
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Right) {
                    var thisColIndex = controls.Grid.getColumn(this);
                    thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                    dragging = thisColIndex >= 0 && parentGrid.columns.count > 1;
                    if (dragging) {
                        leftColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex) - parentGrid.getColumns().at(thisColIndex).minWidth;
                        rightColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex + 1) - parentGrid.getColumns().at(thisColIndex + 1).minWidth;
                    }
                }
                if (dragging) {
                    document.addEventListener("mousemove", this.onSplitterMouseMove, false);
                    document.addEventListener("mouseup", this.onSplitterMouseUp, false);
                    this._draggingStartPoint.x = this._draggingCurrentPoint.x = ev.x;
                    this._draggingStartPoint.y = this._draggingCurrentPoint.y = ev.y;
                    this._draggingVirtualOffset.x = this.visualOffset.x;
                    this._draggingVirtualOffset.y = this.visualOffset.y;
                    if (this.horizontalAlignment == layouts.HorizontalAlignment.Left ||
                        this.horizontalAlignment == layouts.HorizontalAlignment.Right) {
                        this._draggingVirtualOffsetMin.x = this.visualOffset.x - leftColumnWidth;
                        this._draggingVirtualOffsetMax.x = this.visualOffset.x + rightColumnWidth;
                    }
                    else {
                        this._draggingVirtualOffsetMin.y = this.visualOffset.y - topRowHeight;
                        this._draggingVirtualOffsetMax.y = this.visualOffset.y + bottomRowHeight;
                    }
                    ev.stopPropagation();
                }
            };
            GridSplitter.prototype.moveGhost = function (ev) {
                var evX = ev.x;
                var evY = ev.y;
                if (this.horizontalAlignment == layouts.HorizontalAlignment.Right ||
                    this.horizontalAlignment == layouts.HorizontalAlignment.Left) {
                    var evXmax = this._draggingVirtualOffsetMax.x - this._draggingVirtualOffset.x + this._draggingCurrentPoint.x;
                    var evXmin = this._draggingVirtualOffsetMin.x - this._draggingVirtualOffset.x + this._draggingCurrentPoint.x;
                    if (evX > evXmax)
                        evX = evXmax;
                    if (evX < evXmin)
                        evX = evXmin;
                    this._draggingVirtualOffset.x += (evX - this._draggingCurrentPoint.x);
                }
                else {
                    var evYmax = this._draggingVirtualOffsetMax.y - this._draggingVirtualOffset.y + this._draggingCurrentPoint.y;
                    var evYmin = this._draggingVirtualOffsetMin.y - this._draggingVirtualOffset.y + this._draggingCurrentPoint.y;
                    if (evY > evYmax)
                        evY = evYmax;
                    if (evY < evYmin)
                        evY = evYmin;
                    this._draggingVirtualOffset.y += (evY - this._draggingCurrentPoint.y);
                }
                if (this.visualOffset != null) {
                    this._visual.style.left = this._draggingVirtualOffset.x.toString() + "px";
                    this._visual.style.top = this._draggingVirtualOffset.y.toString() + "px";
                }
                this._draggingCurrentPoint.x = evX;
                this._draggingCurrentPoint.y = evY;
                console.log("this._draggingCurrentPoint.x = ", this._draggingCurrentPoint.x);
                console.log("this._draggingCurrentPoint.y = ", this._draggingCurrentPoint.y);
            };
            GridSplitter.prototype.dragSplitter = function (evX, evY) {
                var parentGrid = this.parent;
                if (parentGrid == null)
                    return;
                var saveDraggingStartPoint = true;
                if (this.verticalAlignment == layouts.VerticalAlignment.Top ||
                    this.verticalAlignment == layouts.VerticalAlignment.Bottom) {
                    var thisRowIndex = controls.Grid.getRow(this);
                    thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                    var topRow = parentGrid.rows.elements[this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex - 1 : thisRowIndex];
                    var bottomRow = parentGrid.rows.elements[this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex : thisRowIndex + 1];
                    if (topRow.height.isAuto || bottomRow.height.isAuto)
                        return;
                    if (topRow.height.isFixed || bottomRow.height.isFixed) {
                        var topRowWasStar = false;
                        var bottomRowWasStar = false;
                        if (topRow.height.isStar) {
                            var topRowHeight = parentGrid.getRowFinalHeight(this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex - 1 : thisRowIndex);
                            topRow.height = new controls.GridLength(topRowHeight, controls.GridUnitType.Pixel);
                            topRowWasStar = true;
                        }
                        if (bottomRow.height.isStar) {
                            var bottomRowHeight = parentGrid.getRowFinalHeight(this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex : thisRowIndex + 1);
                            bottomRow.height = new controls.GridLength(bottomRowHeight, controls.GridUnitType.Pixel);
                            bottomRowWasStar = true;
                        }
                        var maxTopRowHeight = topRow.height.value + bottomRow.height.value;
                        var newTopRowHeight = topRow.height.value + (evY - this._draggingStartPoint.y);
                        var newBottomRowHeight = bottomRow.height.value - (evY - this._draggingStartPoint.y);
                        if (newTopRowHeight.isCloseTo(0))
                            newTopRowHeight = 0;
                        if (newTopRowHeight.isCloseTo(maxTopRowHeight))
                            newTopRowHeight = maxTopRowHeight;
                        if (newBottomRowHeight.isCloseTo(0))
                            newBottomRowHeight = 0;
                        if (newBottomRowHeight.isCloseTo(maxTopRowHeight))
                            newBottomRowHeight = maxTopRowHeight;
                        if (newTopRowHeight < 0) {
                            newTopRowHeight = 0;
                            newBottomRowHeight = maxTopRowHeight;
                            this._draggingStartPoint.y += -topRow.height.value;
                            saveDraggingStartPoint = false;
                        }
                        else if (newTopRowHeight > maxTopRowHeight) {
                            newTopRowHeight = maxTopRowHeight;
                            newBottomRowHeight = 0;
                            this._draggingStartPoint.y += -topRow.height.value + maxTopRowHeight;
                            saveDraggingStartPoint = false;
                        }
                        topRow.height = new controls.GridLength(newTopRowHeight, controls.GridUnitType.Pixel);
                        bottomRow.height = new controls.GridLength(newBottomRowHeight, controls.GridUnitType.Pixel);
                        if (bottomRowWasStar || topRowWasStar) {
                            var oldRowWithStarLen = bottomRowWasStar ? bottomRow : topRow;
                            var otherRow = bottomRowWasStar ? topRow : bottomRow;
                            var availTotalHeight = parentGrid.actualHeight;
                            parentGrid.rows.forEach(function (r, i) {
                                if (r == otherRow)
                                    availTotalHeight -= otherRow.height.value;
                                else if (!r.height.isStar && r != oldRowWithStarLen)
                                    availTotalHeight -= parentGrid.getRowFinalHeight(i);
                            });
                            parentGrid.rows.forEach(function (r, i) {
                                if (r.height.isStar)
                                    r.height = new controls.GridLength(parentGrid.getRowFinalHeight(i) / availTotalHeight, controls.GridUnitType.Star);
                                else if (r == oldRowWithStarLen)
                                    r.height = new controls.GridLength(oldRowWithStarLen.height.value / availTotalHeight, controls.GridUnitType.Star);
                            });
                        }
                        parentGrid.invalidateMeasure();
                    }
                    else {
                        var sumFinalHeight = this.verticalAlignment == layouts.VerticalAlignment.Top ?
                            parentGrid.getRowFinalHeight(thisRowIndex - 1) + parentGrid.getRowFinalHeight(thisRowIndex) :
                            parentGrid.getRowFinalHeight(thisRowIndex) + parentGrid.getRowFinalHeight(thisRowIndex + 1);
                        var sumHeight = bottomRow.height.value + topRow.height.value;
                        var heightFactor = sumHeight / sumFinalHeight;
                        var heightStarDiff = (evY - this._draggingStartPoint.y) * heightFactor;
                        var newTopRowHeight = topRow.height.value + heightStarDiff;
                        var newBottomRowHeight = bottomRow.height.value - heightStarDiff;
                        if (newTopRowHeight.isCloseTo(0))
                            newTopRowHeight = 0;
                        if (newTopRowHeight.isCloseTo(sumHeight))
                            newTopRowHeight = sumHeight;
                        if (newBottomRowHeight.isCloseTo(sumHeight))
                            newBottomRowHeight = sumHeight;
                        if (newBottomRowHeight.isCloseTo(0))
                            newBottomRowHeight = 0;
                        if (newTopRowHeight < 0) {
                            heightStarDiff = -topRow.height.value;
                            this._draggingStartPoint.y = (heightStarDiff / heightFactor) + this._draggingStartPoint.y;
                        }
                        else if (newBottomRowHeight < 0) {
                            heightStarDiff = bottomRow.height.value;
                            this._draggingStartPoint.y = (heightStarDiff / heightFactor) + this._draggingStartPoint.y;
                        }
                        if (newTopRowHeight < 0 || newBottomRowHeight > sumHeight) {
                            newTopRowHeight = 0;
                            newBottomRowHeight = sumHeight;
                            saveDraggingStartPoint = false;
                        }
                        else if (newBottomRowHeight < 0 || newTopRowHeight > sumHeight) {
                            newTopRowHeight = sumHeight;
                            newBottomRowHeight = 0;
                            saveDraggingStartPoint = false;
                        }
                        topRow.height = new controls.GridLength(newTopRowHeight, controls.GridUnitType.Star);
                        bottomRow.height = new controls.GridLength(newBottomRowHeight, controls.GridUnitType.Star);
                        parentGrid.invalidateMeasure();
                    }
                }
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Left ||
                    this.horizontalAlignment == layouts.HorizontalAlignment.Right) {
                    var thisColumnIndex = controls.Grid.getColumn(this);
                    thisColumnIndex = Math.min(thisColumnIndex, parentGrid.columns.count - 1);
                    var leftColumn = parentGrid.columns.elements[this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex - 1 : thisColumnIndex];
                    var rightColumn = parentGrid.columns.elements[this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex : thisColumnIndex + 1];
                    if (leftColumn.width.isAuto || rightColumn.width.isAuto)
                        return;
                    if (leftColumn.width.isFixed || rightColumn.width.isFixed) {
                        var leftColumnWasStar = false;
                        var rightColumnWasStar = false;
                        if (leftColumn.width.isStar) {
                            var leftColumnWidth = parentGrid.getColumnFinalWidth(this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex - 1 : thisColumnIndex);
                            leftColumn.width = new controls.GridLength(leftColumnWidth, controls.GridUnitType.Pixel);
                            leftColumnWasStar = true;
                        }
                        if (rightColumn.width.isStar) {
                            var rightColumnWidth = parentGrid.getColumnFinalWidth(this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex : thisColumnIndex + 1);
                            rightColumn.width = new controls.GridLength(rightColumnWidth, controls.GridUnitType.Pixel);
                            rightColumnWasStar = true;
                        }
                        var maxBothColumnWidth = leftColumn.width.value + rightColumn.width.value;
                        var newLeftColumnWidth = leftColumn.width.value + (evX - this._draggingStartPoint.x);
                        var newRightColumnWidth = rightColumn.width.value - (evX - this._draggingStartPoint.x);
                        if (newLeftColumnWidth.isCloseTo(0))
                            newLeftColumnWidth = 0;
                        if (newLeftColumnWidth.isCloseTo(maxBothColumnWidth))
                            newLeftColumnWidth = maxBothColumnWidth;
                        if (newRightColumnWidth.isCloseTo(0))
                            newRightColumnWidth = 0;
                        if (newRightColumnWidth.isCloseTo(maxBothColumnWidth))
                            newRightColumnWidth = maxBothColumnWidth;
                        if (newLeftColumnWidth < 0) {
                            newLeftColumnWidth = 0;
                            newRightColumnWidth = maxBothColumnWidth;
                            this._draggingStartPoint.x += -leftColumn.width.value;
                            saveDraggingStartPoint = false;
                        }
                        else if (newLeftColumnWidth > maxBothColumnWidth) {
                            newLeftColumnWidth = maxBothColumnWidth;
                            newRightColumnWidth = 0;
                            this._draggingStartPoint.x += -leftColumn.width.value + maxBothColumnWidth;
                            saveDraggingStartPoint = false;
                        }
                        leftColumn.width = new controls.GridLength(newLeftColumnWidth, controls.GridUnitType.Pixel);
                        rightColumn.width = new controls.GridLength(newRightColumnWidth, controls.GridUnitType.Pixel);
                        if (rightColumnWasStar || leftColumnWasStar) {
                            var oldColumnWithStarLen = rightColumnWasStar ? rightColumn : leftColumn;
                            var otherColumn = rightColumnWasStar ? leftColumn : rightColumn;
                            var availTotalWidth = parentGrid.actualWidth;
                            parentGrid.columns.forEach(function (r, i) {
                                if (r == otherColumn)
                                    availTotalWidth -= otherColumn.width.value;
                                else if (!r.width.isStar && r != oldColumnWithStarLen)
                                    availTotalWidth -= parentGrid.getColumnFinalWidth(i);
                            });
                            parentGrid.columns.forEach(function (r, i) {
                                if (r.width.isStar)
                                    r.width = new controls.GridLength(parentGrid.getColumnFinalWidth(i) / availTotalWidth, controls.GridUnitType.Star);
                                else if (r == oldColumnWithStarLen)
                                    r.width = new controls.GridLength(oldColumnWithStarLen.width.value / availTotalWidth, controls.GridUnitType.Star);
                            });
                        }
                        parentGrid.invalidateMeasure();
                        layouts.LayoutManager.updateLayout();
                    }
                    else {
                        var sumFinalWidth = this.horizontalAlignment == layouts.HorizontalAlignment.Left ?
                            parentGrid.getColumnFinalWidth(thisColumnIndex - 1) + parentGrid.getColumnFinalWidth(thisColumnIndex) :
                            parentGrid.getColumnFinalWidth(thisColumnIndex) + parentGrid.getColumnFinalWidth(thisColumnIndex + 1);
                        var sumWidth = rightColumn.width.value + leftColumn.width.value;
                        var widthFactor = sumWidth / sumFinalWidth;
                        var widthStarDiff = (evX - this._draggingStartPoint.x) * widthFactor;
                        var newLeftColumnWidth = leftColumn.width.value + widthStarDiff;
                        var newRightColumnWidth = rightColumn.width.value - widthStarDiff;
                        if (newLeftColumnWidth.isCloseTo(0))
                            newLeftColumnWidth = 0;
                        if (newLeftColumnWidth.isCloseTo(sumWidth))
                            newLeftColumnWidth = sumWidth;
                        if (newRightColumnWidth.isCloseTo(sumWidth))
                            newRightColumnWidth = sumWidth;
                        if (newRightColumnWidth.isCloseTo(0))
                            newRightColumnWidth = 0;
                        if (newLeftColumnWidth < 0) {
                            widthStarDiff = -leftColumn.width.value;
                            this._draggingStartPoint.x = (widthStarDiff / widthFactor) + this._draggingStartPoint.x;
                        }
                        else if (newRightColumnWidth < 0) {
                            widthStarDiff = rightColumn.width.value;
                            this._draggingStartPoint.x = (widthStarDiff / widthFactor) + this._draggingStartPoint.x;
                        }
                        if (newLeftColumnWidth < 0 || newRightColumnWidth > sumWidth) {
                            newLeftColumnWidth = 0;
                            newRightColumnWidth = sumWidth;
                            saveDraggingStartPoint = false;
                        }
                        else if (newRightColumnWidth < 0 || newLeftColumnWidth > sumWidth) {
                            newLeftColumnWidth = sumWidth;
                            newRightColumnWidth = 0;
                            saveDraggingStartPoint = false;
                        }
                        leftColumn.width = new controls.GridLength(newLeftColumnWidth, controls.GridUnitType.Star);
                        rightColumn.width = new controls.GridLength(newRightColumnWidth, controls.GridUnitType.Star);
                        parentGrid.invalidateMeasure();
                        layouts.LayoutManager.updateLayout();
                    }
                }
                if (saveDraggingStartPoint) {
                    this._draggingStartPoint.x = evX;
                    this._draggingStartPoint.y = evY;
                }
            };
            return GridSplitter;
        }(controls.Border));
        GridSplitter.typeName = "layouts.controls.GridSplitter";
        controls.GridSplitter = GridSplitter;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Stretch;
        (function (Stretch) {
            Stretch[Stretch["None"] = 0] = "None";
            Stretch[Stretch["Fill"] = 1] = "Fill";
            Stretch[Stretch["Uniform"] = 2] = "Uniform";
            Stretch[Stretch["UniformToFill"] = 3] = "UniformToFill";
        })(Stretch = controls.Stretch || (controls.Stretch = {}));
        var StretchDirection;
        (function (StretchDirection) {
            StretchDirection[StretchDirection["UpOnly"] = 0] = "UpOnly";
            StretchDirection[StretchDirection["DownOnly"] = 1] = "DownOnly";
            StretchDirection[StretchDirection["Both"] = 2] = "Both";
        })(StretchDirection = controls.StretchDirection || (controls.StretchDirection = {}));
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Image.prototype, "typeName", {
                get: function () {
                    return Image.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Image.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._imgElement = document.createElement("img");
                this._visual.style.msUserSelect =
                    this._visual.style.webkitUserSelect = "none";
                var imgElement = this._imgElement;
                imgElement.onload = function (ev) {
                    _this.invalidateMeasure();
                };
                var source = this.source;
                if (source != null &&
                    source.trim().length > 0)
                    imgElement.src = source;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Image.prototype.measureOverride = function (constraint) {
                var imgElement = this._imgElement;
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    return new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight);
                }
                return new layouts.Size();
            };
            Image.prototype.arrangeOverride = function (finalSize) {
                var imgElement = this._imgElement;
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    var scaleFactor = Image.computeScaleFactor(finalSize, new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight), this.stretch, this.stretchDirection);
                    var scaledSize = new layouts.Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
                    if (scaleFactor.width != 1.0 ||
                        scaleFactor.height != 1.0) {
                        imgElement.style.width = scaledSize.width.toString() + "px";
                        imgElement.style.height = scaledSize.height.toString() + "px";
                    }
                    return scaledSize;
                }
                return _super.prototype.arrangeOverride.call(this, finalSize);
            };
            Image.computeScaleFactor = function (availableSize, contentSize, stretch, stretchDirection) {
                var scaleX = 1.0;
                var scaleY = 1.0;
                var isConstrainedWidth = isFinite(availableSize.width);
                var isConstrainedHeight = isFinite(availableSize.height);
                if ((stretch == Stretch.Uniform || stretch == Stretch.UniformToFill || stretch == Stretch.Fill)
                    && (isConstrainedWidth || isConstrainedHeight)) {
                    scaleX = (contentSize.width.isCloseTo(0)) ? 0.0 : availableSize.width / contentSize.width;
                    scaleY = (contentSize.height.isCloseTo(0)) ? 0.0 : availableSize.height / contentSize.height;
                    if (!isConstrainedWidth)
                        scaleX = scaleY;
                    else if (!isConstrainedHeight)
                        scaleY = scaleX;
                    else {
                        switch (stretch) {
                            case Stretch.Uniform:
                                {
                                    var minscale = scaleX < scaleY ? scaleX : scaleY;
                                    scaleX = scaleY = minscale;
                                }
                                break;
                            case Stretch.UniformToFill:
                                {
                                    var maxscale = scaleX > scaleY ? scaleX : scaleY;
                                    scaleX = scaleY = maxscale;
                                }
                                break;
                            case Stretch.Fill:
                                break;
                        }
                    }
                    switch (stretchDirection) {
                        case StretchDirection.UpOnly:
                            if (scaleX < 1.0)
                                scaleX = 1.0;
                            if (scaleY < 1.0)
                                scaleY = 1.0;
                            break;
                        case StretchDirection.DownOnly:
                            if (scaleX > 1.0)
                                scaleX = 1.0;
                            if (scaleY > 1.0)
                                scaleY = 1.0;
                            break;
                        case StretchDirection.Both:
                            break;
                        default:
                            break;
                    }
                }
                return new layouts.Size(scaleX, scaleY);
            };
            Image.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Image.srcProperty) {
                    var imgElement = this._imgElement;
                    if (imgElement != null) {
                        imgElement.src = value == null ? layouts.Consts.stringEmpty : value;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(Image.prototype, "source", {
                get: function () {
                    return this.getValue(Image.srcProperty);
                },
                set: function (value) {
                    this.setValue(Image.srcProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "stretch", {
                get: function () {
                    return this.getValue(Image.stretchProperty);
                },
                set: function (value) {
                    this.setValue(Image.stretchProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "stretchDirection", {
                get: function () {
                    return this.getValue(Image.stretchDirectionProperty);
                },
                set: function (value) {
                    this.setValue(Image.stretchDirectionProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Image;
        }(layouts.FrameworkElement));
        Image.typeName = "layouts.controls.Image";
        Image.srcProperty = layouts.DepObject.registerProperty(Image.typeName, "Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Image.stretchProperty = layouts.DepObject.registerProperty(Image.typeName, "Stretch", Stretch.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Stretch[String(v)]; });
        Image.stretchDirectionProperty = layouts.DepObject.registerProperty(Image.typeName, "StretchDirection", StretchDirection.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return StretchDirection[String(v)]; });
        controls.Image = Image;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ItemsControl = (function (_super) {
            __extends(ItemsControl, _super);
            function ItemsControl() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._elements = null;
                return _this;
            }
            Object.defineProperty(ItemsControl.prototype, "typeName", {
                get: function () {
                    return ItemsControl.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.initProperties = function () {
                layouts.FrameworkElement.overflowYProperty.overrideDefaultValue(ItemsControl.typeName, "auto");
            };
            ItemsControl.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._divElement = document.createElement("div");
                var itemsPanel = this.itemsPanel;
                if (itemsPanel == null)
                    this.itemsPanel = itemsPanel = new controls.Stack();
                itemsPanel.attachVisual(this._visual);
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ItemsControl.prototype.measureOverride = function (constraint) {
                if (this.itemsPanel != null) {
                    this.itemsPanel.measure(constraint);
                    return this.itemsPanel.desiredSize;
                }
                return new layouts.Size();
            };
            ItemsControl.prototype.arrangeOverride = function (finalSize) {
                if (this.itemsPanel != null)
                    this.itemsPanel.arrange(finalSize.toRect());
                return finalSize;
            };
            ItemsControl.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                if (this.itemsPanel != null)
                    this.itemsPanel.layout();
            };
            Object.defineProperty(ItemsControl.prototype, "templates", {
                get: function () {
                    return this._templates;
                },
                set: function (value) {
                    if (value == this._templates)
                        return;
                    if (this._templates != null) {
                        this._templates.offChangeNotify(this);
                    }
                    this._templates = value;
                    if (this._templates != null) {
                        this._templates.forEach(function (el) {
                        });
                        this._templates.onChangeNotify(this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                var _this = this;
                if (collection == this._templates) {
                    this.setupItems();
                }
                else if (collection == this.itemsSource) {
                    if (this.itemsPanel == null)
                        return;
                    added.forEach(function (item) {
                        if (item == null)
                            throw new Error("Unable to render null items");
                        var templateForItem = controls.DataTemplate.getTemplateForItem(_this._templates.toArray(), item);
                        if (templateForItem == null) {
                            throw new Error("Unable to find a valid template for item");
                        }
                        var newElement = templateForItem.createElement();
                        newElement.setValue(layouts.FrameworkElement.dataContextProperty, item);
                        _this.itemsPanel.children.add(newElement);
                    });
                    removed.forEach(function (item) {
                        _this.itemsPanel.children.remove(_this.itemsPanel.children.at(startRemoveIndex++));
                    });
                }
                this.invalidateMeasure();
            };
            Object.defineProperty(ItemsControl.prototype, "itemsSource", {
                get: function () {
                    return this.getValue(ItemsControl.itemsSourceProperty);
                },
                set: function (value) {
                    this.setValue(ItemsControl.itemsSourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ItemsControl.prototype, "itemsPanel", {
                get: function () {
                    return this.getValue(ItemsControl.itemsPanelProperty);
                },
                set: function (value) {
                    this.setValue(ItemsControl.itemsPanelProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == ItemsControl.itemsSourceProperty) {
                    if (oldValue != null && oldValue["offChangeNotify"] != null) {
                        var oldItmesSource = oldValue;
                        oldItmesSource.offChangeNotify(this);
                    }
                    this.setupItems();
                    if (value != null && value["onChangeNotify"] != null) {
                        var newItemsSource = value;
                        newItemsSource.onChangeNotify(this);
                    }
                }
                else if (property == ItemsControl.itemsPanelProperty) {
                    var oldPanel = oldValue;
                    if (oldPanel != null && oldPanel.parent == this) {
                        oldPanel.children = null;
                        oldPanel.parent = null;
                        oldPanel.attachVisual(null);
                    }
                    var newPanel = value;
                    if (newPanel != null) {
                        newPanel.parent = this;
                        if (this._visual != null)
                            newPanel.attachVisual(this._visual);
                    }
                }
                else if (property == ItemsControl.itemsPanelProperty)
                    this.setupItems();
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            ItemsControl.prototype.setupItems = function () {
                var _this = this;
                if (this._elements != null) {
                    this.itemsPanel.children = null;
                    this._elements = null;
                }
                if (this._templates == null ||
                    this._templates.count == 0)
                    return;
                var itemsSource = this.itemsSource;
                if (itemsSource != null) {
                    var elements = null;
                    if (Object.prototype.toString.call(itemsSource) == '[object Array]')
                        elements = itemsSource;
                    else
                        elements = itemsSource["elements"];
                    if (elements == null)
                        throw new Error("Unable to get list of elements from itemsSource");
                    this._elements =
                        elements.map(function (item) {
                            var templateForItem = controls.DataTemplate.getTemplateForItem(_this._templates.toArray(), item);
                            if (templateForItem == null) {
                                throw new Error("Unable to find a valid template for item");
                            }
                            var newElement = templateForItem.createElement();
                            newElement.setValue(layouts.FrameworkElement.dataContextProperty, item);
                            return newElement;
                        });
                }
                if (this._elements != null) {
                    if (this.itemsPanel == null) {
                        this.itemsPanel = new controls.Stack();
                        this.itemsPanel.parent = this;
                        if (this._visual != null)
                            this.itemsPanel.attachVisual(this._visual);
                    }
                    this.itemsPanel.children = new layouts.ObservableCollection(this._elements);
                }
                this.invalidateMeasure();
            };
            return ItemsControl;
        }(layouts.FrameworkElement));
        ItemsControl.typeName = "layouts.controls.ItemsControl";
        ItemsControl._init = ItemsControl.initProperties();
        ItemsControl.itemsSourceProperty = layouts.DepObject.registerProperty(ItemsControl.typeName, "ItemsSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ItemsControl.itemsPanelProperty = layouts.DepObject.registerProperty(ItemsControl.typeName, "ItemsPanel", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ItemsControl = ItemsControl;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var TextBlock = (function (_super) {
            __extends(TextBlock, _super);
            function TextBlock() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(TextBlock.prototype, "typeName", {
                get: function () {
                    return TextBlock.typeName;
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.prototype.createElement = function (elementContainer) {
                return document.createElement("p");
            };
            TextBlock.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._pElement = this.createElement(elementContainer);
                this._visual.style.msUserSelect =
                    this._visual.style.webkitUserSelect = "none";
                this._pElement.style.whiteSpace = this.whiteSpace;
                var text = this.text;
                var format = this.format;
                text = format != null && text != null && text != layouts.Consts.stringEmpty ? format.format(text) : text;
                this._pElement.innerHTML = text == null ? layouts.Consts.stringEmpty : text;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            TextBlock.prototype.measureOverride = function (constraint) {
                var pElement = this._pElement;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            TextBlock.prototype.arrangeOverride = function (finalSize) {
                var pElement = this._pElement;
                pElement.style.width = finalSize.width.toString() + "px";
                pElement.style.height = finalSize.height.toString() + "px";
                return finalSize;
            };
            TextBlock.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == TextBlock.textProperty ||
                    property == TextBlock.formatProperty) {
                    var pElement = this._pElement;
                    var text = value;
                    var format = this.format;
                    text = format != null && text != null && text != layouts.Consts.stringEmpty ? format.format(text) : text;
                    if (pElement != null) {
                        pElement.innerHTML = text == null ? layouts.Consts.stringEmpty : text;
                        this._measuredSize = null;
                    }
                }
                else if (property == TextBlock.whiteSpaceProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.style.whiteSpace = value;
                        this._measuredSize = null;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(TextBlock.prototype, "text", {
                get: function () {
                    return this.getValue(TextBlock.textProperty);
                },
                set: function (value) {
                    this.setValue(TextBlock.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "whiteSpace", {
                get: function () {
                    return this.getValue(TextBlock.whiteSpaceProperty);
                },
                set: function (value) {
                    this.setValue(TextBlock.whiteSpaceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "format", {
                get: function () {
                    return this.getValue(TextBlock.formatProperty);
                },
                set: function (value) {
                    this.setValue(TextBlock.formatProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return TextBlock;
        }(layouts.FrameworkElement));
        TextBlock.typeName = "layouts.controls.TextBlock";
        TextBlock.textProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
        TextBlock.whiteSpaceProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        TextBlock.formatProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "Format", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
        controls.TextBlock = TextBlock;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Label = (function (_super) {
            __extends(Label, _super);
            function Label() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Label.prototype, "typeName", {
                get: function () {
                    return Label.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Label.prototype.createElement = function (elementContainer) {
                this._label = document.createElement("label");
                this._label.htmlFor = this.htmlFor;
                return this._label;
            };
            Object.defineProperty(Label.prototype, "htmlFor", {
                get: function () {
                    return this.getValue(Label.htmlForProperty);
                },
                set: function (value) {
                    this.setValue(Label.htmlForProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Label.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Label.htmlForProperty) {
                    this._label.htmlFor = this.htmlFor;
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            return Label;
        }(controls.TextBlock));
        Label.typeName = "layouts.controls.Label";
        Label.htmlForProperty = layouts.DepObject.registerProperty(Label.typeName, "For", null, layouts.FrameworkPropertyMetadataOptions.None, function (v) { return String(v); });
        controls.Label = Label;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var MediaTemplateSelector = (function (_super) {
            __extends(MediaTemplateSelector, _super);
            function MediaTemplateSelector() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(MediaTemplateSelector.prototype, "typeName", {
                get: function () {
                    return MediaTemplateSelector.typeName;
                },
                enumerable: true,
                configurable: true
            });
            MediaTemplateSelector.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupItem();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            MediaTemplateSelector.prototype.setupItem = function () {
                if (this._container == null)
                    return;
                if (this._element != null) {
                    this._element.attachVisual(null);
                    this._element.parent = null;
                }
                if (this._templates == null ||
                    this._templates.count == 0)
                    return;
                var templateForItem = controls.DataTemplate.getTemplateForMedia(this._templates.toArray());
                if (templateForItem == null) {
                    throw new Error("Unable to find a valid template for this media");
                }
                this._element = templateForItem.createElement();
                if (this._element != null) {
                    this._element.attachVisual(this._container);
                    this._element.parent = this;
                }
                this.invalidateMeasure();
            };
            MediaTemplateSelector.prototype.measureOverride = function (constraint) {
                var child = this._element;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            MediaTemplateSelector.prototype.arrangeOverride = function (finalSize) {
                var child = this._element;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            MediaTemplateSelector.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._element;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            Object.defineProperty(MediaTemplateSelector.prototype, "templates", {
                get: function () {
                    return this._templates;
                },
                set: function (value) {
                    this._templates = value;
                },
                enumerable: true,
                configurable: true
            });
            return MediaTemplateSelector;
        }(layouts.FrameworkElement));
        MediaTemplateSelector.typeName = "layouts.controls.MediaTemplateSelector";
        controls.MediaTemplateSelector = MediaTemplateSelector;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var NativeElement = (function (_super) {
            __extends(NativeElement, _super);
            function NativeElement(elementType) {
                var _this = _super.call(this) || this;
                _this.elementType = elementType;
                return _this;
            }
            Object.defineProperty(NativeElement.prototype, "typeName", {
                get: function () {
                    return NativeElement.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeElement.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    if (this._child != value) {
                        if (this._child != null && this._child.parent == this) {
                            this._child.parent = null;
                            this._child.attachVisual(null);
                        }
                        this._child = value;
                        if (this._child != null) {
                            this._child.parent = this;
                            if (this._visual != null)
                                this._child.attachVisual(this._visual, true);
                        }
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            NativeElement.prototype.invalidateMeasure = function () {
                this._measuredSize = null;
                _super.prototype.invalidateMeasure.call(this);
            };
            NativeElement.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = document.createElement(this.elementType);
                var text = this.text;
                if (text != null)
                    this._visual.innerHTML = text;
                if (this._child != null) {
                    var childVisual = this._child.attachVisual(this._visual, true);
                    if (childVisual != null && !this.arrangeChild)
                        childVisual.style.position = layouts.Consts.stringEmpty;
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            NativeElement.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == NativeElement.textProperty && this._visual != null) {
                    this._visual.innerHTML = value;
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            NativeElement.prototype.measureOverride = function (constraint) {
                if (this.arrangeChild) {
                    if (this._child != null)
                        this._child.measure(constraint);
                }
                var pElement = this._visual;
                ;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            NativeElement.prototype.arrangeOverride = function (finalSize) {
                var pElement = this._visual;
                pElement.style.width = finalSize.width.toString() + "px";
                pElement.style.height = finalSize.height.toString() + "px";
                if (this.arrangeChild) {
                    var child = this.child;
                    if (child != null) {
                        child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                    }
                }
                return finalSize;
            };
            Object.defineProperty(NativeElement.prototype, "text", {
                get: function () {
                    return this.getValue(NativeElement.textProperty);
                },
                set: function (value) {
                    this.setValue(NativeElement.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeElement.prototype, "arrangeChild", {
                get: function () {
                    return this.getValue(NativeElement.arrangeChildProperty);
                },
                set: function (value) {
                    this.setValue(NativeElement.arrangeChildProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return NativeElement;
        }(layouts.FrameworkElement));
        NativeElement.typeName = "layouts.controls.NativeElement";
        NativeElement.textProperty = layouts.DepObject.registerProperty(NativeElement.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
        NativeElement.arrangeChildProperty = layouts.DepObject.registerProperty(NativeElement.typeName, "ArrangeChild", true, layouts.FrameworkPropertyMetadataOptions.None, function (v) { return v != null && v.trim().toLowerCase() == "true"; });
        controls.NativeElement = NativeElement;
        var div = (function (_super) {
            __extends(div, _super);
            function div() {
                return _super.call(this, "div") || this;
            }
            Object.defineProperty(div.prototype, "typeName", {
                get: function () {
                    return div.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return div;
        }(NativeElement));
        div.typeName = "layouts.controls.div";
        controls.div = div;
        var a = (function (_super) {
            __extends(a, _super);
            function a() {
                return _super.call(this, "a") || this;
            }
            Object.defineProperty(a.prototype, "typeName", {
                get: function () {
                    return a.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return a;
        }(NativeElement));
        a.typeName = "layouts.controls.a";
        controls.a = a;
        var img = (function (_super) {
            __extends(img, _super);
            function img() {
                return _super.call(this, "img") || this;
            }
            Object.defineProperty(img.prototype, "typeName", {
                get: function () {
                    return img.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return img;
        }(NativeElement));
        img.typeName = "layouts.controls.img";
        controls.img = img;
        var i = (function (_super) {
            __extends(i, _super);
            function i() {
                return _super.call(this, "i") || this;
            }
            Object.defineProperty(i.prototype, "typeName", {
                get: function () {
                    return i.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return i;
        }(NativeElement));
        i.typeName = "layouts.controls.i";
        controls.i = i;
        var ul = (function (_super) {
            __extends(ul, _super);
            function ul() {
                return _super.call(this, "ul") || this;
            }
            Object.defineProperty(ul.prototype, "typeName", {
                get: function () {
                    return ul.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return ul;
        }(NativeElement));
        ul.typeName = "layouts.controls.ul";
        controls.ul = ul;
        var li = (function (_super) {
            __extends(li, _super);
            function li() {
                return _super.call(this, "li") || this;
            }
            Object.defineProperty(li.prototype, "typeName", {
                get: function () {
                    return li.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return li;
        }(NativeElement));
        li.typeName = "layouts.controls.li";
        controls.li = li;
        var nav = (function (_super) {
            __extends(nav, _super);
            function nav() {
                return _super.call(this, "nav") || this;
            }
            Object.defineProperty(nav.prototype, "typeName", {
                get: function () {
                    return nav.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return nav;
        }(NativeElement));
        nav.typeName = "layouts.controls.nav";
        controls.nav = nav;
        var span = (function (_super) {
            __extends(span, _super);
            function span() {
                return _super.call(this, "span") || this;
            }
            Object.defineProperty(span.prototype, "typeName", {
                get: function () {
                    return span.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return span;
        }(NativeElement));
        span.typeName = "layouts.controls.span";
        controls.span = span;
        var h1 = (function (_super) {
            __extends(h1, _super);
            function h1() {
                return _super.call(this, "h1") || this;
            }
            Object.defineProperty(h1.prototype, "typeName", {
                get: function () {
                    return h1.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h1;
        }(NativeElement));
        h1.typeName = "layouts.controls.h1";
        controls.h1 = h1;
        var h2 = (function (_super) {
            __extends(h2, _super);
            function h2() {
                return _super.call(this, "h2") || this;
            }
            Object.defineProperty(h2.prototype, "typeName", {
                get: function () {
                    return h2.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h2;
        }(NativeElement));
        h2.typeName = "layouts.controls.h2";
        controls.h2 = h2;
        var h3 = (function (_super) {
            __extends(h3, _super);
            function h3() {
                return _super.call(this, "h3") || this;
            }
            Object.defineProperty(h3.prototype, "typeName", {
                get: function () {
                    return h3.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h3;
        }(NativeElement));
        h3.typeName = "layouts.controls.h3";
        controls.h3 = h3;
        var h4 = (function (_super) {
            __extends(h4, _super);
            function h4() {
                return _super.call(this, "h4") || this;
            }
            Object.defineProperty(h4.prototype, "typeName", {
                get: function () {
                    return h4.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h4;
        }(NativeElement));
        h4.typeName = "layouts.controls.h4";
        controls.h4 = h4;
        var h5 = (function (_super) {
            __extends(h5, _super);
            function h5() {
                return _super.call(this, "h5") || this;
            }
            Object.defineProperty(h5.prototype, "typeName", {
                get: function () {
                    return h5.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h5;
        }(NativeElement));
        h5.typeName = "layouts.controls.h5";
        controls.h5 = h5;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Orientation;
        (function (Orientation) {
            Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
            Orientation[Orientation["Vertical"] = 1] = "Vertical";
        })(Orientation = controls.Orientation || (controls.Orientation = {}));
        var Stack = (function (_super) {
            __extends(Stack, _super);
            function Stack() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Stack.prototype, "typeName", {
                get: function () {
                    return Stack.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Stack.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                var orientation = this.orientation;
                if (this.children == null)
                    return mySize;
                this.children.forEach(function (child) {
                    if (orientation == Orientation.Horizontal) {
                        child.measure(new layouts.Size(Infinity, constraint.height));
                        mySize.width += child.desiredSize.width;
                        mySize.height = Math.max(mySize.height, child.desiredSize.height);
                    }
                    else {
                        child.measure(new layouts.Size(constraint.width, Infinity));
                        mySize.width = Math.max(mySize.width, child.desiredSize.width);
                        mySize.height += child.desiredSize.height;
                    }
                });
                if (this.virtualItemCount > this.children.count) {
                    if (orientation == Orientation.Horizontal)
                        mySize.width += (mySize.width / this.children.count) * (this.virtualItemCount - this.children.count);
                    else
                        mySize.height += (mySize.height / this.children.count) * (this.virtualItemCount - this.children.count);
                }
                return mySize;
            };
            Stack.prototype.arrangeOverride = function (finalSize) {
                var orientation = this.orientation;
                var posChild = new layouts.Vector();
                var childrenSize = new layouts.Size();
                if (this.children != null) {
                    this.children.forEach(function (child) {
                        var sizeChild = new layouts.Size();
                        if (orientation == Orientation.Horizontal) {
                            sizeChild.width = child.desiredSize.width;
                            sizeChild.height = Math.max(finalSize.height, child.desiredSize.height);
                        }
                        else {
                            sizeChild.height = child.desiredSize.height;
                            sizeChild.width = Math.max(finalSize.width, child.desiredSize.width);
                        }
                        child.arrange(new layouts.Rect(posChild.x, posChild.y, sizeChild.width, sizeChild.height));
                        if (orientation == Orientation.Horizontal) {
                            posChild.x += sizeChild.width;
                            childrenSize.width += sizeChild.width;
                            childrenSize.height = Math.max(childrenSize.height, sizeChild.height);
                        }
                        else {
                            posChild.y += sizeChild.height;
                            childrenSize.width = Math.max(childrenSize.width, sizeChild.width);
                            childrenSize.height += sizeChild.height;
                        }
                    });
                }
                if (orientation == Orientation.Horizontal)
                    return new layouts.Size(Math.max(finalSize.width, childrenSize.width), finalSize.height);
                else
                    return new layouts.Size(finalSize.width, Math.max(finalSize.height, childrenSize.height));
            };
            Object.defineProperty(Stack.prototype, "orientation", {
                get: function () {
                    return this.getValue(Stack.orientationProperty);
                },
                set: function (value) {
                    this.setValue(Stack.orientationProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Stack;
        }(controls.Panel));
        Stack.typeName = "layouts.controls.Stack";
        Stack.orientationProperty = layouts.DepObject.registerProperty(Stack.typeName, "Orientation", Orientation.Vertical, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Orientation[String(v)]; });
        controls.Stack = Stack;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var TextBox = (function (_super) {
            __extends(TextBox, _super);
            function TextBox() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(TextBox.prototype, "typeName", {
                get: function () {
                    return TextBox.typeName;
                },
                enumerable: true,
                configurable: true
            });
            TextBox.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._pElement = document.createElement("input");
                this._pElement.value = this.text;
                this._pElement.type = this.type;
                this._pElement.readOnly = this.isReadonly;
                this._pElement.placeholder = this.placeholder;
                this._pElement.oninput = function (ev) { return _this.onTextChanged(); };
                this._pElement.onchange = function (ev) { return _this.onTextChanged(); };
                this._pElement.onkeypress = function (ev) { return _this.onTextChanged(); };
                this._pElement.onpaste = function (ev) { return _this.onTextChanged(); };
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            TextBox.prototype.onTextChanged = function () {
                this.text = this._pElement.value;
            };
            TextBox.prototype.measureOverride = function (constraint) {
                var pElement = this._pElement;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.offsetWidth, pElement.offsetHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            TextBox.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                if (this.renderSize != null) {
                    this._pElement.style.width = (this.renderSize.width - (this._pElement.offsetWidth - this.renderSize.width)) + "px";
                    this._pElement.style.height = (this.renderSize.height - (this._pElement.offsetHeight - this.renderSize.height)) + "px";
                }
            };
            TextBox.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == TextBox.textProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        this._pElement.value = value;
                    }
                }
                else if (property == TextBox.placeholderProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.placeholder = value;
                    }
                }
                else if (property == TextBox.typeProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.type = value;
                    }
                }
                else if (property == TextBox.isReadonlyProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.readOnly = value;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(TextBox.prototype, "text", {
                get: function () {
                    return this.getValue(TextBox.textProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBox.prototype, "placeholder", {
                get: function () {
                    return this.getValue(TextBox.placeholderProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.placeholderProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBox.prototype, "type", {
                get: function () {
                    return this.getValue(TextBox.typeProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.typeProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBox.prototype, "isReadonly", {
                get: function () {
                    return this.getValue(TextBox.isReadonlyProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.isReadonlyProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return TextBox;
        }(layouts.FrameworkElement));
        TextBox.typeName = "layouts.controls.TextBox";
        TextBox.textProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        TextBox.placeholderProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Placeholder", "", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        TextBox.typeProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Type", "text", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        TextBox.isReadonlyProperty = layouts.DepObject.registerProperty(TextBox.typeName, "IsReadonly", false);
        controls.TextBox = TextBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var UserControl = (function (_super) {
            __extends(UserControl, _super);
            function UserControl() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(UserControl.prototype, "typeName", {
                get: function () {
                    return UserControl.typeName;
                },
                enumerable: true,
                configurable: true
            });
            UserControl.prototype.initializeComponent = function () {
                return null;
            };
            UserControl.prototype.tryLoadChildFromServer = function () {
                var _this = this;
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (ev) {
                    if (req.readyState == 4 && req.status == 200) {
                        var loader = new layouts.XamlReader();
                        _this.setupChild(loader.Parse(req.responseText));
                    }
                };
                req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
                req.send();
            };
            UserControl.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupChild(this.initializeComponent());
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            UserControl.prototype.setupChild = function (content) {
                var child = this._content;
                if (child == null) {
                    this._content = child = content;
                    if (child != null)
                        child.parent = this;
                }
                child = this._content;
                if (child != null) {
                    child.attachVisual(this._container);
                }
                else {
                    this.tryLoadChildFromServer();
                }
            };
            UserControl.prototype.invalidateMeasure = function () {
                _super.prototype.invalidateMeasure.call(this);
                var child = this._content;
                if (child != null) {
                    child.invalidateMeasure();
                }
            };
            UserControl.prototype.invalidateArrange = function () {
                _super.prototype.invalidateArrange.call(this);
                var child = this._content;
                if (child != null) {
                    child.invalidateArrange();
                }
            };
            UserControl.prototype.invalidateLayout = function () {
                _super.prototype.invalidateLayout.call(this);
                var child = this._content;
                if (child != null) {
                    child.invalidateLayout();
                }
            };
            UserControl.prototype.measureOverride = function (constraint) {
                var child = this._content;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            UserControl.prototype.arrangeOverride = function (finalSize) {
                var child = this._content;
                if (child != null) {
                    child.arrange(finalSize.toRect());
                }
                this.invalidateLayout();
                return finalSize;
            };
            UserControl.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._content;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            return UserControl;
        }(layouts.FrameworkElement));
        UserControl.typeName = "layouts.controls.UserControl";
        controls.UserControl = UserControl;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var EasingFunctions = (function () {
        function EasingFunctions() {
        }
        EasingFunctions.linearTween = function (t, b, c, d) {
            return c * t / d + b;
        };
        ;
        EasingFunctions.easeInQuad = function (t, b, c, d) {
            t /= d;
            return c * t * t + b;
        };
        ;
        EasingFunctions.easeOutQuad = function (t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        };
        ;
        EasingFunctions.easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        ;
        EasingFunctions.easeInCubic = function (t, b, c, d) {
            t /= d;
            return c * t * t * t + b;
        };
        ;
        EasingFunctions.easeOutCubic = function (t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        };
        ;
        EasingFunctions.easeInOutCubic = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };
        ;
        EasingFunctions.easeInQuart = function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t + b;
        };
        ;
        EasingFunctions.easeOutQuart = function (t, b, c, d) {
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        };
        ;
        EasingFunctions.easeInOutQuart = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t * t * t + b;
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        };
        ;
        EasingFunctions.easeInQuint = function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t * t + b;
        };
        ;
        EasingFunctions.easeOutQuint = function (t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t * t * t + 1) + b;
        };
        ;
        EasingFunctions.easeInOutQuint = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        };
        ;
        EasingFunctions.easeInSine = function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        };
        ;
        EasingFunctions.easeOutSine = function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        };
        ;
        EasingFunctions.easeInOutSine = function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        };
        ;
        EasingFunctions.easeInExpo = function (t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        };
        ;
        EasingFunctions.easeOutExpo = function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
        ;
        EasingFunctions.easeInOutExpo = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            t--;
            return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        };
        ;
        EasingFunctions.easeInCirc = function (t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        };
        ;
        EasingFunctions.easeOutCirc = function (t, b, c, d) {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t * t) + b;
        };
        ;
        EasingFunctions.easeInOutCirc = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        };
        ;
        return EasingFunctions;
    }());
    layouts.EasingFunctions = EasingFunctions;
})(layouts || (layouts = {}));
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
    }());
    layouts.Timer = Timer;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var XamlReader = (function () {
        function XamlReader(instanceLoader, namespaceResolver) {
            this.instanceLoader = instanceLoader;
            this.namespaceResolver = namespaceResolver;
            this._createdObjectsWithId = {};
            if (this.instanceLoader == null)
                this.instanceLoader = new InstanceLoader(window);
        }
        XamlReader.prototype.Parse = function (lml) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            return this.Load(doc);
        };
        XamlReader.prototype.resolveNameSpace = function (xmlns) {
            if (xmlns == null ||
                xmlns == XamlReader.DefaultNamespace)
                return "layouts.controls";
            if (this.namespaceResolver != null)
                return this.namespaceResolver(xmlns);
            return xmlns;
        };
        XamlReader.prototype.Load = function (xamlNode) {
            var _this = this;
            var ns = this.resolveNameSpace(xamlNode.namespaceURI);
            var typeName = ns != null ? ns + "." + xamlNode.localName : xamlNode.localName;
            var containerObject = this.instanceLoader.getInstance(typeName);
            if (containerObject == null)
                throw new Error("Unable to create instance of '{0}'".format(typeName));
            if (xamlNode.attributes != null) {
                for (var i = 0; i < xamlNode.attributes.length; i++) {
                    var att = xamlNode.attributes[i];
                    var propertyName = att.localName;
                    if (!this.trySetProperty(containerObject, propertyName, this.resolveNameSpace(att.namespaceURI), att.value))
                        if (containerObject["addExtentedProperty"] != null)
                            containerObject["addExtentedProperty"](propertyName, att.value);
                    if (propertyName == "id")
                        this._createdObjectsWithId[att.value] = containerObject;
                }
            }
            var childrenProperties = xamlNode.childNodes.where(function (_) { return _.nodeType == 1 && _.localName.indexOf(".") > -1; });
            childrenProperties.forEach(function (childNode) {
                var indexOfDot = childNode.localName.indexOf(".");
                if (childNode.localName.substr(0, indexOfDot) == xamlNode.localName) {
                    var propertyName = childNode.localName.substr(indexOfDot + 1);
                    var childOfChild = childNode.childNodes.firstOrDefault(function (_) { return _.nodeType == 1; }, null);
                    var valueToSet = childOfChild == null ? null : _this.Load(childOfChild);
                    _this.trySetProperty(containerObject, propertyName, _this.resolveNameSpace(childNode.namespaceURI), valueToSet);
                }
            });
            var children = xamlNode.childNodes.where(function (_) { return _.nodeType == 1 && _.localName.indexOf(".") == -1; });
            if (containerObject["setInnerXaml"] != null) {
                if (children.length > 0)
                    containerObject["setInnerXaml"]((new XMLSerializer()).serializeToString(children[0]));
                if (containerObject["setXamlLoader"] != null)
                    containerObject["setXamlLoader"](this);
                return containerObject;
            }
            if (children.length == 0)
                return containerObject;
            if (layouts.Ext.hasProperty(containerObject, "content") || layouts.Ext.hasProperty(containerObject, "child")) {
                var contentPropertyName = layouts.Ext.hasProperty(containerObject, "content") ? "content" : "child";
                containerObject[contentPropertyName] = this.Load(children[0]);
            }
            else {
                var collectionPropertyName = null;
                if (layouts.Ext.hasProperty(containerObject, "children"))
                    collectionPropertyName = "children";
                if (layouts.Ext.hasProperty(containerObject, "items"))
                    collectionPropertyName = "items";
                if (layouts.Ext.hasProperty(containerObject, "templates"))
                    collectionPropertyName = "templates";
                if (layouts.Ext.hasProperty(containerObject, "animations"))
                    collectionPropertyName = "animations";
                if (collectionPropertyName != null) {
                    var listOfChildren = children.map(function (childNode) { return _this.Load(childNode); });
                    containerObject[collectionPropertyName] = new layouts.ObservableCollection(listOfChildren);
                }
            }
            return containerObject;
        };
        XamlReader.compareXml = function (nodeLeft, nodeRight) {
            if (nodeLeft == null && nodeRight == null)
                return true;
            if (nodeLeft.localName != nodeRight.localName ||
                nodeLeft.namespaceURI != nodeRight.namespaceURI)
                return false;
            if (nodeLeft.attributes != null &&
                nodeRight.attributes != null &&
                nodeLeft.attributes.length != nodeRight.attributes.length)
                return false;
            for (var i = 0; i < nodeLeft.attributes.length; i++) {
                var attLeft = nodeLeft.attributes[i];
                var attRight = nodeRight.attributes[i];
                if (attLeft.name != attRight.name ||
                    attLeft.namespaceURI != attRight.namespaceURI ||
                    attLeft.value != attRight.value)
                    return false;
            }
            var childrenLeft = nodeLeft.childNodes.where(function (_) { return _.nodeType == 1; });
            var childrenRight = nodeRight.childNodes.where(function (_) { return _.nodeType == 1; });
            if (childrenLeft.length != childrenRight.length)
                return false;
            for (var i = 0; i < childrenLeft.length; i++) {
                var childNodeLeft = childrenLeft[i];
                var childNodeRight = childrenRight[i];
                if (!XamlReader.compareXml(childNodeLeft, childNodeRight))
                    return false;
            }
            return true;
        };
        XamlReader.prototype.trySetProperty = function (obj, propertyName, propertyNameSpace, value) {
            if (obj == null)
                return false;
            if (obj instanceof layouts.DepObject) {
                var depObject = obj;
                var typeName = depObject["typeName"];
                var depProperty;
                var indexOfDot = propertyName.indexOf(".");
                if (indexOfDot > -1) {
                    typeName = propertyNameSpace == null ? propertyName.substr(0, indexOfDot) : propertyNameSpace + "." + propertyName.substr(0, indexOfDot);
                    propertyName = propertyName.replace(".", "#");
                    depProperty = layouts.DepObject.getProperty(typeName, propertyName);
                }
                else
                    depProperty = layouts.DepObject.lookupProperty(depObject, propertyName);
                if (depProperty != null) {
                    var bindingDef = layouts.Ext.isString(value) ? XamlReader.tryParseBinding(value) : null;
                    if (bindingDef != null) {
                        var converter = bindingDef.converter == null ? null : this.instanceLoader.getInstance(bindingDef.converter);
                        if (converter == null &&
                            bindingDef.converter != null)
                            throw new Error("Unable to create converter from '{0}'".format(bindingDef.converter));
                        var isDCProperty = depProperty == layouts.FrameworkElement.dataContextProperty;
                        var isElementNameDefined = bindingDef.element != null;
                        var bindingPath = bindingDef.source == "self" || isElementNameDefined ? bindingDef.path :
                            isDCProperty ? "parentDataContext." + bindingDef.path :
                                bindingDef.path == "." ? "DataContext" :
                                    "DataContext." + bindingDef.path;
                        var source = depObject;
                        if (isElementNameDefined) {
                            if (!(bindingDef.element in this._createdObjectsWithId))
                                console.log("[Bindings] Unable to find element with id '{0}'".format(bindingDef.element));
                            else
                                source = this._createdObjectsWithId[bindingDef.element];
                        }
                        depObject.bind(depProperty, bindingPath, bindingDef.mode != null && bindingDef.mode.toLowerCase() == "twoway", source, converter, bindingDef.converterParameter, bindingDef.format);
                    }
                    else
                        depObject.setValue(depProperty, value);
                    return true;
                }
                else if (obj.hasOwnProperty(propertyName)) {
                    obj[propertyName] = value;
                    return true;
                }
                else
                    return this.trySetProperty(obj["__proto__"], propertyName, propertyNameSpace, value);
            }
            if (obj.hasOwnProperty(propertyName)) {
                obj[propertyName] = value;
                return true;
            }
            return false;
        };
        XamlReader.tryCallMethod = function (obj, methodName, value) {
            if (obj == null)
                return false;
            if (obj[methodName] != null) {
                obj[methodName](value);
                return true;
            }
            return false;
        };
        XamlReader.tryParseBinding = function (value) {
            var bindingValue = value.trim();
            if (bindingValue.length >= 3 &&
                bindingValue[0] == '{' &&
                bindingValue[bindingValue.length - 1] == '}') {
                try {
                    var bindingDef = new Object();
                    var tokens = bindingValue.substr(1, bindingValue.length - 2).split(",");
                    tokens.forEach(function (t) {
                        var keyValue = t.split(":");
                        if (keyValue.length == 2) {
                            var value = keyValue[1].trim();
                            if (value.length > 2 &&
                                value[0] == '\'' &&
                                value[value.length - 1] == '\'')
                                value = value.substr(1, value.length - 2);
                            bindingDef[keyValue[0].trim()] = value;
                        }
                        else if (keyValue.length == 1)
                            bindingDef["path"] = keyValue[0].trim();
                        else
                            throw Error("syntax error");
                    });
                    return bindingDef;
                }
                catch (e) {
                    console.log("[Bindings] Unable to parse '{0}' as binding definition".format(bindingValue));
                }
            }
            return null;
        };
        return XamlReader;
    }());
    XamlReader.DefaultNamespace = "http://schemas.layouts.com/";
    layouts.XamlReader = XamlReader;
})(layouts || (layouts = {}));
window.onload = function () {
    var app = layouts.Application.current;
    app.page = AppView.getMainPage();
    var appViewModel = new AppViewModel();
    appViewModel.loadSavedSamples();
    app.page.dataContext = appViewModel;
};
var AceView = (function (_super) {
    __extends(AceView, _super);
    function AceView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._changeTimer = null;
        _this._reentrantFlag = false;
        return _this;
    }
    Object.defineProperty(AceView.prototype, "typeName", {
        get: function () {
            return AceView.typeName;
        },
        enumerable: true,
        configurable: true
    });
    AceView.prototype.attachVisualOverride = function (elementContainer) {
        var _this = this;
        this._visual = this._divElement = document.createElement("div");
        _super.prototype.attachVisualOverride.call(this, elementContainer);
        if (this._editor == null) {
            this._editor = ace.edit(this._visual);
            this._editor.setTheme("ace/theme/clouds");
            this._editor.getSession().setMode("ace/mode/xml");
            this._editor.addEventListener("change", function (ev) {
                if (_this._changeTimer == null)
                    _this._changeTimer = new layouts.Timer(function (timer) { return _this.updateSourceProperty(); }, 1000);
                _this._changeTimer.start();
            });
            if (this.sourceCode != null)
                this._editor.setValue(this.sourceCode);
        }
    };
    AceView.prototype.onDocumentChange = function () {
    };
    AceView.prototype.updateSourceProperty = function () {
        this._changeTimer.stop();
        this._reentrantFlag = true;
        this.sourceCode = this._editor.getValue();
        this._reentrantFlag = false;
    };
    Object.defineProperty(AceView.prototype, "sourceCode", {
        get: function () {
            return this.getValue(AceView.sourceCodeProperty);
        },
        set: function (value) {
            this.setValue(AceView.sourceCodeProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    AceView.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
        if (property == AceView.sourceCodeProperty &&
            this._editor != null &&
            !this._reentrantFlag)
            this._editor.setValue(value == null ? "" : value);
        _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
    };
    return AceView;
}(layouts.FrameworkElement));
AceView.typeName = "aceEditor";
AceView.sourceCodeProperty = layouts.DepObject.registerProperty(AceView.typeName, "SourceCode", null);
var AppViewModel = (function (_super) {
    __extends(AppViewModel, _super);
    function AppViewModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._items = new layouts.ObservableCollection();
        return _this;
    }
    Object.defineProperty(AppViewModel.prototype, "typeName", {
        get: function () {
            return AppViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            if (this._selected != value) {
                var oldValue = this._selected;
                this._selected = value;
                this.onPropertyChanged("selected", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "addCommand", {
        get: function () {
            var _this = this;
            if (this._addCommand == null)
                this._addCommand = new layouts.Command(function (cmd, p) { return _this.onAddItem(); }, function (cmd, p) { return true; });
            return this._addCommand;
        },
        enumerable: true,
        configurable: true
    });
    AppViewModel.prototype.onAddItem = function () {
        this._items.add(new CodeViewModel(this));
        this.selected = this._items.last();
        this.selected.title = "Code " + this._items.count;
    };
    AppViewModel.prototype.loadSavedSamples = function () {
        var _this = this;
        var jsonFile = new XMLHttpRequest();
        jsonFile.onreadystatechange = function (ev) {
            if (jsonFile.readyState == 4 && jsonFile.status == 200) {
                var jsonContent = JSON.parse(jsonFile.responseText);
                var samples = jsonContent;
                for (var i = 0; i < samples.length; i++) {
                    var sample = new CodeViewModel(_this, true);
                    sample.title = samples[i].Title;
                    sample.sourceCode = samples[i].Code;
                    _this._items.add(sample);
                }
                for (var i = 0; i < localStorage.length; i++) {
                    var sample = new CodeViewModel(_this);
                    sample.title = "Code " + (i + 1);
                    sample.sourceCode = localStorage.getItem(sample.title);
                    _this._items.add(sample);
                }
                _this.selected = _this._items.first();
            }
        };
        jsonFile.open("GET", "Samples.txt", true);
        jsonFile.send();
    };
    return AppViewModel;
}(layouts.DepObject));
AppViewModel.typeName = "appViewModel";
var AppView = (function () {
    function AppView() {
    }
    Object.defineProperty(AppView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page>  \n  <Grid Rows=\"48 *\" Columns=\"150 *\">\n    <!-- Header -->\n    <Border id=\"header\" Grid.Column=\"1\">\n        \n    </Border>\n\n    <!-- Logo Area -->\n    <Border id=\"logo\" >\n        <TextBlock Text=\"Layouts Page Editor\" VerticalAlignment=\"Center\" HorizontalAlignment=\"Center\"/>\n    </Border>\n\n    <!-- Left Side -->\n    <Border id=\"leftSide\" Grid.Row=\"1\">\n        <Grid Rows=\"Auto *\">\n            <Button Text=\"New...\" Command=\"{addCommand}\" Margin=\"4\"/>\n            <ItemsControl Grid.Row=\"1\" ItemsSource=\"{items}\" Margin=\"4,0,4,4\">\n                <DataTemplate>\n                    <Button Text=\"{title}\" Command=\"{selectCommand}\" Margin=\"4\"/>\n                </DataTemplate>                \n            </ItemsControl>\n        </Grid>\n    </Border>\n\n    <!-- Main Area -->\n    <Border id=\"mainArea\" Grid.Row=\"1\" Grid.Column=\"1\">\n        <ControlTemplate DataContext=\"{selected}\" Content=\"{view}\"/>\n    </Border>\n\n  </Grid>\n</Page>";
        },
        enumerable: true,
        configurable: true
    });
    AppView.getMainPage = function () {
        if (AppView._page == null) {
            var loader = new layouts.XamlReader();
            AppView._page = loader.Parse(AppView.PAGE_DEFINITION);
        }
        return AppView._page;
    };
    return AppView;
}());
var CodeView = (function () {
    function CodeView() {
    }
    Object.defineProperty(CodeView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Border xmlns:localViews=\"Layouts.PageEditor\">\n  <Grid Columns=\"* *\">\n    <!-- Ace Editor -->\n    <localViews:AceView SourceCode=\"{path:sourceCode,mode:twoway}\"/>\n\n    <!-- Run Area -->\n    <Border id=\"runArea\" Grid.Column=\"1\">\n        <ControlTemplate Content=\"{createdControl}\"/>\n    </Border>\n\n  </Grid>\n</Border>";
        },
        enumerable: true,
        configurable: true
    });
    CodeView.getView = function () {
        var loader = new layouts.XamlReader();
        loader.namespaceResolver = function (ns) {
            if (ns == "Layouts.PageEditor")
                return null;
            return null;
        };
        return loader.Parse(CodeView.PAGE_DEFINITION);
    };
    return CodeView;
}());
var CodeViewModel = (function (_super) {
    __extends(CodeViewModel, _super);
    function CodeViewModel(owner, isSampleCode) {
        if (isSampleCode === void 0) { isSampleCode = false; }
        var _this = _super.call(this) || this;
        _this.owner = owner;
        _this._isSampleCode = false;
        _this._isSampleCode = isSampleCode;
        return _this;
    }
    Object.defineProperty(CodeViewModel.prototype, "typeName", {
        get: function () {
            return CodeViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            if (this._title != value) {
                var oldValue = this._title;
                this._title = value;
                this.onPropertyChanged("title", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "sourceCode", {
        get: function () {
            return this._sourceCode;
        },
        set: function (value) {
            if (this._sourceCode != value) {
                var oldValue = this._sourceCode;
                this._sourceCode = value;
                this.onPropertyChanged("sourceCode", value, oldValue);
                this.onSourceCodeChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    CodeViewModel.prototype.onSourceCodeChanged = function () {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.sourceCode, "text/xml").documentElement;
            if (this._oldParsedDocument == null ||
                !layouts.XamlReader.compareXml(this._oldParsedDocument, doc)) {
                this._oldParsedDocument = doc;
                var loader = new layouts.XamlReader();
                this.createdControl = loader.Load(doc);
                if (!this._isSampleCode)
                    localStorage.setItem(this.title, this.sourceCode);
            }
        }
        catch (error) {
            return;
        }
    };
    Object.defineProperty(CodeViewModel.prototype, "createdControl", {
        get: function () {
            return this._createdControl;
        },
        set: function (value) {
            if (this._createdControl != value) {
                var oldValue = this._createdControl;
                this._createdControl = value;
                this.onPropertyChanged("createdControl", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "view", {
        get: function () {
            if (this._view == null) {
                this._view = CodeView.getView();
            }
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "selectCommand", {
        get: function () {
            var _this = this;
            if (this._selectCommand == null)
                this._selectCommand = new layouts.Command(function (cmd, p) { return _this.onSelectItem(); }, function (cmd, p) { return true; });
            return this._selectCommand;
        },
        enumerable: true,
        configurable: true
    });
    CodeViewModel.prototype.onSelectItem = function () {
        this.owner.selected = this;
    };
    return CodeViewModel;
}(layouts.DepObject));
CodeViewModel.typeName = "codeViewModel";
