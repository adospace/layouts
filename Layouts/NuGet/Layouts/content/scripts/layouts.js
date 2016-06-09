var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
Number.prototype.isLessThen = function (other) {
    return (this - other) < 1e-10;
};
Number.prototype.isGreaterThen = function (other) {
    return (this - other) > 1e-10;
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
        //find namespaces if any
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
            //default value map
            this._defaultValueMap = {};
            this._defaultValue = defaultValue;
            this.options = options;
            this.converter = converter;
        }
        DepProperty.prototype.overrideDefaultValue = function (typeName, defaultValue) {
            this._defaultValueMap[typeName] = defaultValue;
        };
        //get default value of this property for passed object
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
        Consts.stringEmpty = "";
        return Consts;
    }());
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
/// <reference path="DepProperty.ts" />
/// <reference path="PropertyMap.ts" />
/// <reference path="Consts.ts" />
/// <reference path="IConverter.ts" />
var layouts;
(function (layouts) {
    var DepObject = (function () {
        function DepObject() {
            this.localPropertyValueMap = {};
            this.dpcHandlers = [];
            this.pcHandlers = [];
            this.bindings = new Array();
        }
        ///Register a dependency property for the object
        DepObject.registerProperty = function (typeName, name, defaultValue, options, converter) {
            if (DepObject.globalPropertyMap[typeName] == null)
                DepObject.globalPropertyMap[typeName] = new layouts.PropertyMap();
            var newProperty = new layouts.DepProperty(name, typeName, defaultValue, options, converter);
            DepObject.globalPropertyMap[typeName].register(name, newProperty);
            return newProperty;
        };
        ///Get the dependency property registered with this type of object (or null if property doesn't exist on object)
        DepObject.getProperty = function (typeName, name) {
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;
            return DepObject.globalPropertyMap[typeName].getProperty(name);
        };
        ///Get only dependency properties registered with this type of object
        DepObject.getProperties = function (typeName) {
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;
            return DepObject.globalPropertyMap[typeName].all();
        };
        ///Iterate over all dependency properties registered with this type of object and its ancestors
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
        //Get property value for this object
        DepObject.prototype.getValue = function (property) {
            if (property.name in this.localPropertyValueMap) {
                return this.localPropertyValueMap[property.name];
            }
            return property.getDefaultValue(this);
        };
        //set property value to this object
        DepObject.prototype.setValue = function (property, value) {
            var oldValue = this.getValue(property);
            var valueToSet = property.converter != null && layouts.Ext.isString(value) ? property.converter(value) : value;
            if (oldValue != valueToSet) {
                this.localPropertyValueMap[property.name] = valueToSet;
                this.onDependencyPropertyChanged(property, valueToSet, oldValue);
            }
        };
        //reset property value to its default
        DepObject.prototype.resetValue = function (property) {
            if (property.name in this.localPropertyValueMap) {
                var oldValue = this.getValue(property);
                delete this.localPropertyValueMap[property.name];
                this.onDependencyPropertyChanged(property, null, oldValue);
            }
        };
        //Called when a value of a dependency property is changed (manually or by a binding)
        DepObject.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
            var _this = this;
            this.dpcHandlers.forEach(function (h) {
                h.onDependencyPropertyChanged(_this, property);
            });
        };
        //subscribe to dep property change events
        DepObject.prototype.subscribeDependencyPropertyChanges = function (observer) {
            if (this.dpcHandlers.indexOf(observer) == -1)
                this.dpcHandlers.push(observer);
        };
        //unsubscribe from dep property change events
        DepObject.prototype.unsubscribeDependencyPropertyChanges = function (observer) {
            var index = this.dpcHandlers.indexOf(observer, 0);
            if (index != -1) {
                this.dpcHandlers.splice(index, 1);
            }
        };
        //Called when a value of a plain property is changed
        DepObject.prototype.onPropertyChanged = function (propertyName, value, oldValue) {
            var _this = this;
            this.pcHandlers.forEach(function (h) {
                h.onChangeProperty(_this, propertyName, value);
            });
        };
        //subscribe to property change events
        DepObject.prototype.subscribePropertyChanges = function (observer) {
            if (this.pcHandlers.indexOf(observer) == -1)
                this.pcHandlers.push(observer);
        };
        //unsubscribe from property change events
        DepObject.prototype.unsubscribePropertyChanges = function (observer) {
            var index = this.pcHandlers.indexOf(observer, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        };
        //bind a property of this object to a source object thru a path
        DepObject.prototype.bind = function (property, propertyPath, twoway, source, converter, converterParameter, format) {
            var newBinding = new Binding(this, property, propertyPath, source, twoway, converter, converterParameter, format);
            this.bindings.push(newBinding);
        };
        ///Map of properties for each dependency object
        DepObject.globalPropertyMap = {};
        DepObject.logBindingTraceToConsole = false;
        return DepObject;
    }());
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
                this.target.setValue(this.targetProperty, this.format != null ? this.format.format(valueToSet) : valueToSet); //update target
            }
            else if (this.source != null) {
                //if source is not null and retValue.success is false
                //means that something in binding to original source has broken
                //I need to reset the source and update target property to its default value
                this.target.resetValue(this.targetProperty);
                this.source = null;
                this.sourceProperty = null;
            }
        };
        Binding.prototype.onDependencyPropertyChanged = function (depObject, depProperty) {
            if (depObject == this.target &&
                depProperty == this.targetProperty &&
                this.twoWay) {
                //if target property value is changed than update source
                //(twoway mode on)
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
            //if source is not a depObject I can't subscribe/unsubscribe to its property changes
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
                // View your result using the m-variable.
                // eg m[0] etc.
                //there is at least an indexer in the form property[...]...
                //property name is returned in m[1]
                this.name = m[1];
                //so get the first indexer and save it in this.indexers
                this.indexers = [];
                this.indexers.push(m[3]);
                //for now support up to 2 indexer like 'property[..][..]'
                //search for a second indexer if exists
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
                    //first token of path is the name of property to look in source object
                    this.name = this.path.substring(0, dotIndex);
                    this.lookForIndexers();
                    this.sourceProperty = DepObject.lookupProperty(this.source, this.name);
                    //NOTE: this.source can be n UIElement(quite often) and it has custom getValue method that looks for parent values
                    //for the same property given it has FrameworkPropertyMetadataOptions.Inherits as option defined for property
                    //see UEelement.ts/getValue
                    var sourcePropertyValue = (this.sourceProperty != null) ?
                        this.source.getValue(this.sourceProperty) :
                        this.source[this.name]; //otherwise try using normal property lookup method
                    //if an indexer list is defined (binding to something like 'property[...]...')
                    //go deeper to property value accessed with the indexer
                    if (this.indexers != null && sourcePropertyValue != null) {
                        sourcePropertyValue = sourcePropertyValue[this.indexers[0]];
                        if (this.indexers.length > 1 && sourcePropertyValue != null)
                            sourcePropertyValue = sourcePropertyValue[this.indexers[1]];
                    }
                    if (sourcePropertyValue != null) {
                        //is source value is not null means I can go further in search...
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
                this.next.attachShource(); //attachSource() test if already attached
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
                    this.source[this.name]; //otherwise try using normal property lookup method
                //if an indexer list is defined (binding to something like 'property[...]...')
                //go deeper to property value accessed with the indexer
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
                    this.source[this.name] = value; //try update source using default property lookup access
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
/// <reference path="DepProperty.ts" />
/// <reference path="DepObject.ts" />
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
    (function (FrameworkPropertyMetadataOptions) {
        /// No flags
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["None"] = 0] = "None";
        /// This property affects measurement
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsMeasure"] = 1] = "AffectsMeasure";
        /// This property affects arragement
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsArrange"] = 2] = "AffectsArrange";
        /// This property affects parent's measurement
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsParentMeasure"] = 4] = "AffectsParentMeasure";
        /// This property affects parent's arrangement
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsParentArrange"] = 8] = "AffectsParentArrange";
        /// This property affects rendering
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["AffectsRender"] = 16] = "AffectsRender";
        /// This property inherits to children
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["Inherits"] = 32] = "Inherits";
        /// NOT SUPPORTED: 
        /// This property causes inheritance and resource lookup to override values 
        /// of InheritanceBehavior that may be set on any FE in the path of lookup
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["OverridesInheritanceBehavior"] = 64] = "OverridesInheritanceBehavior";
        /// This property does not support data binding
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["NotDataBindable"] = 128] = "NotDataBindable";
        /// Data bindings on this property default to two-way
        FrameworkPropertyMetadataOptions[FrameworkPropertyMetadataOptions["BindsTwoWayByDefault"] = 256] = "BindsTwoWayByDefault";
    })(layouts.FrameworkPropertyMetadataOptions || (layouts.FrameworkPropertyMetadataOptions = {}));
    var FrameworkPropertyMetadataOptions = layouts.FrameworkPropertyMetadataOptions;
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
            _super.apply(this, arguments);
            ///Render Pass
            this.relativeOffset = null;
            this.measureDirty = true;
            this.arrangeDirty = true;
            this.layoutInvalid = true;
            //extended properties are key-value items that loader was unable to assign to element
            //because they didn't not correspond to any property (dependency or native) exposed by element
            this._extendedProperties = [];
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
            this.desiredSize = this.measureCore(availableSize);
            if (isNaN(this.desiredSize.width) ||
                !isFinite(this.desiredSize.width) ||
                isNaN(this.desiredSize.height) ||
                !isFinite(this.desiredSize.height))
                throw new Error("measure pass must return valid size");
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
                    //if visual is hidden here means that I just added it hidden to DOM
                    //so restore it visible (see attachVisual() below)
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
        UIElement.prototype.attachVisual = function (elementContainer, showImmediately) {
            if (showImmediately === void 0) { showImmediately = false; }
            //1. if a visual is not yet created and we have a container
            //try create it now
            if (this._visual == null &&
                elementContainer != null)
                this.attachVisualOverride(elementContainer);
            //1.b if a visual doesn't exists but parent set container to null
            //call attachVisualOverride and let derived class handle the case (i.e. Page)
            if (this._visual == null &&
                elementContainer == null)
                this.attachVisualOverride(null);
            //2. if visual is still null we have done
            if (this._visual == null)
                return;
            //3. if visual is not under container...
            if (elementContainer != this._visual.parentElement) {
                //4. remove visual from old container 
                if (this._visual.parentElement != null) {
                    //Note children of this are not removed from DOM
                    //for performance reasons, it would take to much to remove any descendants from DOM
                    var parentElement = this._visual.parentElement;
                    parentElement.removeChild(this._visual);
                    //this will notify any children of removal
                    this.visualDisconnected(parentElement);
                }
                //5. if container is valid (not null) add visual under it
                //note container could be null in this case visual is just detached from DOM
                if (elementContainer != null) {
                    //before add the element to the DOM tree hide to avoid flickering
                    //visual will be restored to visible after it's correctly positioned
                    //see above layout()
                    //NOTE: we use CSS visibility instead of hidden property because with former
                    //element size remains valid 
                    //http://stackoverflow.com/questions/2345784/jquery-get-height-of-hidden-element-in-jquery
                    if (!showImmediately)
                        this._visual.style.visibility = "hidden";
                    //makes layout invalid so to restore any render in case element was just removed and readded to tree
                    this.invalidateMeasure();
                    elementContainer.appendChild(this._visual);
                    if (elementContainer != null)
                        this.visualConnected(elementContainer);
                }
            }
        };
        UIElement.prototype.attachVisualOverride = function (elementContainer) {
            var _this = this;
            if (this._visual == null)
                return;
            //apply extended properties to html element
            this._extendedProperties.forEach(function (ep) {
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
                document.addEventListener("mouseup", function () {
                    this.removeEventListener("mouseup", arguments.callee);
                    layouts.LayoutManager.closePopup(popup);
                });
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
            //probably this checks as well as relative properties are to be moved down to FrameworkElement
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
                //foreach child notify property changing event, unfortunately
                //there is not a more efficient way than walk logical tree down to leaves
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
                    //search property on parent
                    return this._parent.getValue(property);
                }
                //get default
                return property.getDefaultValue(this);
            }
            //there is a local value
            return this.localPropertyValueMap[property.name];
        };
        UIElement.prototype.invalidateMeasure = function () {
            if (!this.measureDirty) {
                this.measureDirty = true;
                this.arrangeDirty = true;
                this.layoutInvalid = true;
                if (this._parent != null)
                    this._parent.invalidateMeasure();
            }
        };
        UIElement.prototype.invalidateArrange = function () {
            if (!this.arrangeDirty) {
                this.arrangeDirty = true;
                this.layoutInvalid = true;
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
                    //if my parent changed I need to notify children to update
                    //any binding linked to my properties that has FrameworkPropertyMetadataOptions.Inherits
                    //option (most of cases dataContext)
                    //there is not a real value change, only a notification to allow binding update
                    //so value==oldValue
                    //if (this._logicalChildren != null) {
                    //    var value = this.getValue(property);
                    //    this._logicalChildren.forEach((child) => child.onDependencyPropertyChanged(property, value, value));
                    //}
                    this.onParentDependencyPropertyChanged(property);
                }
            }
            if (this._parent != null)
                this._parent.notifyInheritsPropertiesChange();
        };
        //function called when a parent property changed 
        //(parent property must have FrameworkPropertyMetadataOptions.Inherits option enabled; most of cases is DataContext property)
        UIElement.prototype.onParentDependencyPropertyChanged = function (property) {
            if (this._logicalChildren != null) {
                this._logicalChildren.forEach(function (child) { return child.onParentDependencyPropertyChanged(property); });
            }
            //just notify subscribers of bindings
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
        UIElement.typeName = "layouts.UIElement";
        UIElement.isVisibleProperty = layouts.DepObject.registerProperty(UIElement.typeName, "IsVisible", true, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsParentMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        //static styleProperty = DepObject.registerProperty(UIElement.typeName, "cssStyle", Consts.stringEmpty, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsParentMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        //get cssStyle(): string {
        //    return <string>this.getValue(UIElement.styleProperty);
        //}
        //set cssStyle(value: string) {
        //    this.setValue(UIElement.styleProperty, value);
        //}
        UIElement.classProperty = layouts.DepObject.registerProperty(UIElement.typeName, "class", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        //name property
        UIElement.idProperty = layouts.DepObject.registerProperty(UIElement.typeName, "id", layouts.Consts.stringEmpty, FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.commandProperty = layouts.DepObject.registerProperty(UIElement.typeName, "Command", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.commandParameterProperty = layouts.DepObject.registerProperty(UIElement.typeName, "CommandParameter", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        //get or set popup property for the element
        UIElement.popupProperty = layouts.DepObject.registerProperty(UIElement.typeName, "Popup", null, FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.layoutUpdatedProperty = layouts.DepObject.registerProperty(UIElement.typeName, "LayoutUpdated", null, FrameworkPropertyMetadataOptions.None);
        return UIElement;
    }(layouts.DepObject));
    layouts.UIElement = UIElement;
})(layouts || (layouts = {}));
/// <reference path="DepProperty.ts" />
/// <reference path="DepObject.ts" />
/// <reference path="UIElement.ts" />
var layouts;
(function (layouts) {
    (function (VerticalAlignment) {
        VerticalAlignment[VerticalAlignment["Top"] = 0] = "Top";
        VerticalAlignment[VerticalAlignment["Center"] = 1] = "Center";
        VerticalAlignment[VerticalAlignment["Bottom"] = 2] = "Bottom";
        VerticalAlignment[VerticalAlignment["Stretch"] = 3] = "Stretch";
    })(layouts.VerticalAlignment || (layouts.VerticalAlignment = {}));
    var VerticalAlignment = layouts.VerticalAlignment;
    (function (HorizontalAlignment) {
        HorizontalAlignment[HorizontalAlignment["Left"] = 0] = "Left";
        HorizontalAlignment[HorizontalAlignment["Center"] = 1] = "Center";
        HorizontalAlignment[HorizontalAlignment["Right"] = 2] = "Right";
        HorizontalAlignment[HorizontalAlignment["Stretch"] = 3] = "Stretch";
    })(layouts.HorizontalAlignment || (layouts.HorizontalAlignment = {}));
    var HorizontalAlignment = layouts.HorizontalAlignment;
    (function (SizeToContent) {
        SizeToContent[SizeToContent["None"] = 0] = "None";
        SizeToContent[SizeToContent["Both"] = 1] = "Both";
        SizeToContent[SizeToContent["Vertical"] = 2] = "Vertical";
        SizeToContent[SizeToContent["Horizontal"] = 3] = "Horizontal";
    })(layouts.SizeToContent || (layouts.SizeToContent = {}));
    var SizeToContent = layouts.SizeToContent;
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
            _super.apply(this, arguments);
            //private needClipBounds: boolean;
            this.visualOffset = null;
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
            //var clipped = false;
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
            //this.needClipBounds = false;
            if (arrangeSize.width.isCloseTo(this.unclippedDesiredSize.width) ||
                arrangeSize.width < this.unclippedDesiredSize.width) {
                //this.needClipBounds = true;
                arrangeSize.width = this.unclippedDesiredSize.width;
            }
            if (arrangeSize.height.isCloseTo(this.unclippedDesiredSize.height) ||
                arrangeSize.height < this.unclippedDesiredSize.height) {
                //this.needClipBounds = true;
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
                //this.needClipBounds = true;
                arrangeSize.width = effectiveMaxWidth;
            }
            var effectiveMaxHeight = Math.max(this.unclippedDesiredSize.height, mm.maxHeight);
            if (effectiveMaxHeight.isCloseTo(arrangeSize.height) ||
                effectiveMaxHeight < arrangeSize.height) {
                //this.needClipBounds = true;
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
            //if (this._visual != null)
            //    this._visual.style.cssText = this.cssStyle;
            _super.prototype.layoutOverride.call(this);
            if (this._visual == null)
                return;
            //this._visual.style.position = "absolute";
            this._visual.style.visibility = this.isVisible ? "" : "collapsed";
            this._visual.style.overflowX = this.overflowX;
            this._visual.style.overflowY = this.overflowY;
            if (this.visualOffset != null) {
                //for left and top default value is not 0 so
                //I've to specify both always
                this._visual.style.left = this.visualOffset.x.toString() + "px";
                this._visual.style.top = this.visualOffset.y.toString() + "px";
            }
            if (this.renderSize != null) {
                //when an element starts hidden renderSize is not available
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
        FrameworkElement.typeName = "layouts.FrameworkElement";
        //width property
        FrameworkElement.widthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Width", Number.NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //height property
        FrameworkElement.heightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Height", Number.NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //actualWidth property
        FrameworkElement.actualWidthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "ActualWidth", 0);
        //actualHeight property
        FrameworkElement.actualHeightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "ActualHeight", 0);
        //minWidth property
        FrameworkElement.minWidthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MinWidth", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        //minHeight property
        FrameworkElement.minHeightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MinHeight", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        //maxWidth property
        FrameworkElement.maxWidthProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MaxWidth", Infinity, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        //maxHeight property
        FrameworkElement.maxHeightProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "MaxHeight", Infinity, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
        //verticalAlignment property
        FrameworkElement.verticalAlignmentProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "VerticalAlignment", VerticalAlignment.Stretch, layouts.FrameworkPropertyMetadataOptions.AffectsArrange, function (v) { return VerticalAlignment[String(v)]; });
        //horizontalAlignment property
        FrameworkElement.horizontalAlignmentProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "HorizontalAlignment", HorizontalAlignment.Stretch, layouts.FrameworkPropertyMetadataOptions.AffectsArrange, function (v) { return HorizontalAlignment[String(v)]; });
        //margin property
        FrameworkElement.marginProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Margin", new Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Thickness.fromString(v); });
        //dataContext property
        FrameworkElement.dataContextProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "DataContext", null, layouts.FrameworkPropertyMetadataOptions.Inherits);
        //tag property
        FrameworkElement.tagProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "Tag");
        //overflowX property -> visible|hidden|scroll|auto
        //by default content is clipped so overflowX is set to hidden
        FrameworkElement.overflowXProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "OverflowX", "hidden", layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        //overflowY property -> visible|hidden|scroll|auto
        //by default content is clipped so overflowY is set to hidden
        FrameworkElement.overflowYProperty = layouts.DepObject.registerProperty(FrameworkElement.typeName, "OverflowY", "hidden", layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        return FrameworkElement;
    }(layouts.UIElement));
    layouts.FrameworkElement = FrameworkElement;
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
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
        })(controls.PopupPosition || (controls.PopupPosition = {}));
        var PopupPosition = controls.PopupPosition;
        var Popup = (function (_super) {
            __extends(Popup, _super);
            function Popup() {
                _super.call(this);
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
                        if (_this._child != null) {
                            _this._child.parent = _this;
                            _this._child.attachVisual(document.body);
                        }
                    }
                };
                req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
                req.send();
            };
            Popup.prototype.attachVisualOverride = function (elementContainer) {
                _super.prototype.attachVisualOverride.call(this, elementContainer);
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
                if (this._child != null) {
                    this._child.parent = this;
                    this._child.attachVisual(document.body);
                }
                else
                    this.tryLoadChildFromServer();
            };
            Popup.prototype.onClose = function () {
                if (this._child != null && this._child.parent == this) {
                    this._child.attachVisual(null);
                    this._child.parent = null;
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
                //  arrange child
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
            Popup.typeName = "layouts.controls.Popup";
            Popup._init = Popup.initProperties();
            //SizeToContent property
            Popup.sizeToContentProperty = layouts.DepObject.registerProperty(Popup.typeName, "SizeToContent", layouts.SizeToContent.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.SizeToContent[String(v)]; });
            Popup.positionProperty = layouts.DepObject.registerProperty(Popup.typeName, "Position", PopupPosition.Center, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return PopupPosition[String(v)]; });
            return Popup;
        }(layouts.FrameworkElement));
        controls.Popup = Popup;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="controls/Popup.ts" />
var layouts;
(function (layouts) {
    var LayoutManager = (function () {
        function LayoutManager() {
        }
        LayoutManager.updateLayout = function () {
            var page = layouts.Application.current.page;
            //var docWidth = document.body.clientWidth;
            var docWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
            //var docHeight = document.body.clientHeight;
            var docHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
            //docWidth /= window.devicePixelRatio || 1;
            //docHeight /= window.devicePixelRatio || 1;
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
        LayoutManager.popups = [];
        return LayoutManager;
    }());
    layouts.LayoutManager = LayoutManager;
    window.onresize = function () {
        LayoutManager.updateLayout();
    };
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
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
                _super.apply(this, arguments);
                //navigation system
                //if cachePage is true navigation system reuse already loaded page
                this.cachePage = false;
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
                //  arrange child
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
            //onNavigate method is called also for reused/cached pages
            Page.prototype.onNavigate = function (context) {
            };
            Page.typeName = "layouts.controls.Page";
            Page.childProperty = layouts.DepObject.registerProperty(Page.typeName, "Child", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            //SizeToContent property
            Page.sizeToContentProperty = layouts.DepObject.registerProperty(Page.typeName, "SizeToContent", layouts.SizeToContent.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.SizeToContent[String(v)]; });
            return Page;
        }(layouts.FrameworkElement));
        controls.Page = Page;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="Extensions.ts" />
/// <reference path="LayoutManager.ts" />
/// <reference path="Controls\Page.ts" />
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
                ///example:
                ///   /Product/{value1}/{value2}/{value3}
                ///compile in:
                ///   \/Product\/([\w\d_$]+)\/([\w\d_$]+)\/([\w\d_$]+)
                //var re = /\{([\w\d_$]+)\}/gi;
                var re = new RegExp("\\{([\\w\\d_&$-]+)\\}", "gi");
                var s = this.uri;
                var m;
                var rx = this.uri.split("/").join("\\/");
                do {
                    m = re.exec(s);
                    if (m) {
                        //console.log(m[0], m[1]);
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
        UriMapping._rxMapping = new RegExp("\{([\w\d_&$]+)\}", "gi");
        return UriMapping;
    }());
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
            this._navigationStack = new Array();
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
            //get current application
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
        //Dispatcher Thread
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
            var mappings = Enumerable.From(this._mappings);
            var uriMapping = mappings.FirstOrDefault(null, function (m) { return m.uri == uri; });
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
            if (this._currentNavigationitem != null &&
                this._currentNavigationitem.uri == uri)
                return true;
            var mappings = Enumerable.From(this._mappings);
            var uriMapping = mappings.FirstOrDefault(null, function (m) { return m.test(uri); });
            if (uriMapping != null) {
                var queryString = uriMapping.resolve(uri);
                if (this._currentNavigationitem != null) {
                    var currentNavigationItem = this._currentNavigationitem;
                    var navigationStack = this._navigationStack;
                    while (navigationStack.length > 0 &&
                        navigationStack[navigationStack.length - 1] != currentNavigationItem) {
                        navigationStack.pop();
                    }
                    //save page if required
                    if (this.page.cachePage)
                        this._currentNavigationitem.cachedPage = this.page;
                }
                var previousPage = this.page;
                var previousUri = this._currentNavigationitem != null ? this._currentNavigationitem.uri : null;
                if (loader == null)
                    loader = new InstanceLoader(window);
                var targetPage = loader.getInstance(uriMapping.mapping);
                if (targetPage == null) {
                    throw new Error("Unable to navigate to page '{0}'".format(uriMapping.mapping));
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
                this._currentNavigationitem = new NavigationItem(uri);
                this._navigationStack.push(this._currentNavigationitem);
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
        Application._beginInvokeActions = [];
        return Application;
    }());
    layouts.Application = Application;
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
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
                _super.apply(this, arguments);
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
                // Compute the chrome size added by the various elements
                var border = new layouts.Size(this.borderThickness.left + this.borderThickness.right, this.borderThickness.top + this.borderThickness.bottom);
                var padding = new layouts.Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
                //If we have a child
                if (this._child != null) {
                    // Combine into total decorating size
                    var combined = new layouts.Size(border.width + padding.width, border.height + padding.height);
                    // Remove size of border only from child's reference size.
                    var childConstraint = new layouts.Size(Math.max(0.0, constraint.width - combined.width), Math.max(0.0, constraint.height - combined.height));
                    this._child.measure(childConstraint);
                    var childSize = this._child.desiredSize;
                    // Now use the returned size to drive our size, by adding back the margins, etc.
                    mySize.width = childSize.width + combined.width;
                    mySize.height = childSize.height + combined.height;
                }
                else {
                    // Combine into total decorating size
                    mySize = new layouts.Size(border.width + padding.width, border.height + padding.height);
                }
                return mySize;
            };
            Border.prototype.arrangeOverride = function (finalSize) {
                var borders = this.borderThickness;
                var boundRect = new layouts.Rect(0, 0, finalSize.width, finalSize.height);
                var innerRect = new layouts.Rect(boundRect.x + borders.left, boundRect.y + borders.top, Math.max(0.0, boundRect.width - borders.left - borders.right), Math.max(0.0, boundRect.height - borders.top - borders.bottom));
                //  arrange child
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
                var borders = this.borderThickness;
                if (this._visual != null && this.renderSize != null) {
                    this._visual.style.width = (this.renderSize.width - (borders.left + borders.right)).toString() + "px";
                    this._visual.style.height = (this.renderSize.height - (borders.top + borders.bottom)).toString() + "px";
                }
                if (this._child != null)
                    this._child.layout();
            };
            Border.prototype.updateVisualProperties = function () {
                if (this._visual == null)
                    return;
                this._visual.style.background = this.background;
                this._visual.style.borderColor = this.borderBrush;
                this._visual.style.borderStyle = this.borderStyle;
                var borderThickness = this.borderThickness;
                if (borderThickness.isSameWidth)
                    this._visual.style.borderWidth = borderThickness.left.toString() + "px";
                else {
                    this._visual.style.borderLeft = borderThickness.left.toString() + "px";
                    this._visual.style.borderTop = borderThickness.top.toString() + "px";
                    this._visual.style.borderRight = borderThickness.right.toString() + "px";
                    this._visual.style.borderBottom = borderThickness.bottom.toString() + "px";
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
            Border.typeName = "layouts.controls.Border";
            Border.borderThicknessProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderThickness", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.Thickness.fromString(v); });
            Border.paddingProperty = layouts.DepObject.registerProperty(Border.typeName, "Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.Thickness.fromString(v); });
            Border.backgroundProperty = layouts.DepObject.registerProperty(Border.typeName, "Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.borderBrushProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderBrush", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.borderStyleProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderStyle", "solid", layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Border;
        }(layouts.FrameworkElement));
        controls.Border = Border;
    })(controls = layouts.controls || (layouts.controls = {}));
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
        //subscribe to command canExecute change events
        Command.prototype.onCanExecuteChangeNotify = function (handler) {
            if (this.handlers.indexOf(handler) == -1)
                this.handlers.push(handler);
        };
        //unsubscribe to command canExecute change events
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
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
/// <reference path="..\Command.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button() {
                _super.apply(this, arguments);
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
                //this._buttonElement.onclick = (ev) => this.onClick(ev);
                this._buttonElement.disabled = !this.isEnabled;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Button.prototype.measureOverride = function (constraint) {
                this.isEnabled = this.popup != null || (this.command != null && this.command.canExecute(this.commandParameter));
                var mySize = new layouts.Size();
                // Compute the chrome size added by padding
                var padding = new layouts.Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
                //If we have a child
                if (this._child != null) {
                    // Remove size of padding only from child's reference size.
                    var childConstraint = new layouts.Size(Math.max(0.0, constraint.width - padding.width), Math.max(0.0, constraint.height - padding.height));
                    this._child.measure(childConstraint);
                    var childSize = this._child.desiredSize;
                    // Now use the returned size to drive our size, by adding back the margins, etc.
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
                    // Combine into total decorating size
                    mySize = new layouts.Size(padding.width, padding.height);
                }
                return mySize;
            };
            Button.prototype.arrangeOverride = function (finalSize) {
                //  arrange child
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
            Button.typeName = "layouts.controls.Button";
            //Dependency properties
            Button.paddingProperty = layouts.DepObject.registerProperty(Button.typeName, "Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.textProperty = layouts.DepObject.registerProperty(Button.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.whiteSpaceProperty = layouts.DepObject.registerProperty(Button.typeName, "WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.isEnabledProperty = layouts.DepObject.registerProperty(Button.typeName, "IsEnabled", true, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Button;
        }(layouts.FrameworkElement));
        controls.Button = Button;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel() {
                _super.apply(this, arguments);
                //virtual items
                this.virtualItemCount = 0;
                this.virtualOffset = null;
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
                        //reset parent on all children
                        this._children.forEach(function (el) {
                            if (el.parent == _this) {
                                el.parent = null;
                                el.attachVisual(null);
                            }
                        });
                        //remove handler so that resource can be disposed
                        this._children.offChangeNotify(this);
                    }
                    this._children = value;
                    if (this._children != null) {
                        //attach new children here
                        this._children.forEach(function (el) {
                            if (el.parent != null) {
                                //if already child of a different parent throw error
                                //in future investigate if it can be removed from container automatically
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
            Panel.typeName = "layouts.controls.Panel";
            Panel.backgroundProperty = layouts.DepObject.registerProperty(Panel.typeName, "Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Panel;
        }(layouts.FrameworkElement));
        controls.Panel = Panel;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas() {
                _super.apply(this, arguments);
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
            Canvas.typeName = "layouts.controls.Canvas";
            //properties
            //Canvas.Left property
            Canvas.leftProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Left", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            //Canvas.Top property
            Canvas.topProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Top", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            //Canvas.Right property
            Canvas.rightProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Right", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            //Canvas.Bottom property
            Canvas.bottomProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Bottom", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            return Canvas;
        }(controls.Panel));
        controls.Canvas = Canvas;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ContentTemplate = (function (_super) {
            __extends(ContentTemplate, _super);
            function ContentTemplate() {
                _super.apply(this, arguments);
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
                    return; //not yet ready to create content element
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
                    //NOTE: Set datacontext before attach element to DOM
                    //If it's attached without datacontext, bindings will target parent datacontext (ie my datacontext)
                    //and when the correct datacontext is attached again to content, bindings will re-target to 
                    //new context
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
            ContentTemplate.typeName = "layouts.controls.ContentTemplate";
            ContentTemplate.contentProperty = layouts.DepObject.registerProperty(ContentTemplate.typeName, "Content", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return ContentTemplate;
        }(layouts.FrameworkElement));
        controls.ContentTemplate = ContentTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ControlTemplate = (function (_super) {
            __extends(ControlTemplate, _super);
            function ControlTemplate() {
                _super.apply(this, arguments);
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
                        //NOTE: change parent AFTER attachVisual because changing parent will raise
                        //notifications to binding to DataContext
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
            ControlTemplate.typeName = "layouts.controls.ControlTemplate";
            ControlTemplate.contentProperty = layouts.DepObject.registerProperty(ControlTemplate.typeName, "Content", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return ControlTemplate;
        }(layouts.FrameworkElement));
        controls.ControlTemplate = ControlTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ControlTemplateSelector = (function (_super) {
            __extends(ControlTemplateSelector, _super);
            function ControlTemplateSelector() {
                _super.apply(this, arguments);
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
                        //remove handler so that resource can be disposed
                        this._templates.offChangeNotify(this);
                    }
                    this._templates = value;
                    if (this._templates != null) {
                        this._templates.forEach(function (el) {
                            //to do: re-apply templates to children
                        });
                        this._templates.onChangeNotify(this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            ControlTemplateSelector.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                if (collection == this._templates) {
                    //templates collection is changed
                    this.setupItem();
                }
                this.invalidateMeasure();
            };
            ControlTemplateSelector.typeName = "layouts.controls.ControlTemplateSelector";
            ControlTemplateSelector.contentSourceProperty = layouts.DepObject.registerProperty(ControlTemplateSelector.typeName, "ContentSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return ControlTemplateSelector;
        }(layouts.FrameworkElement));
        controls.ControlTemplateSelector = ControlTemplateSelector;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Frame = (function (_super) {
            __extends(Frame, _super);
            function Frame() {
                _super.apply(this, arguments);
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
            Frame.typeName = "layouts.controls.Frame";
            Frame.sourceProperty = layouts.DepObject.registerProperty(Frame.typeName, "Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Frame;
        }(layouts.FrameworkElement));
        controls.Frame = Frame;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        (function (GridUnitType) {
            /// The value indicates that content should be calculated without constraints. 
            GridUnitType[GridUnitType["Auto"] = 0] = "Auto";
            /// The value is expressed as a pixel.
            GridUnitType[GridUnitType["Pixel"] = 1] = "Pixel";
            /// The value is expressed as a weighted proportion of available space.
            GridUnitType[GridUnitType["Star"] = 2] = "Star";
        })(controls.GridUnitType || (controls.GridUnitType = {}));
        var GridUnitType = controls.GridUnitType;
        var GridLength = (function () {
            function GridLength(value, type) {
                if (type === void 0) { type = GridUnitType.Pixel; }
                if (value.isCloseTo(0))
                    value = 0;
                this._value = value;
                this._type = type;
            }
            GridLength.parseString = function (value) {
                //parse a string in the form of:
                // ([number],){0.1},[*|Auto|number],([number],){0.1} --> min*,[...],max*
                // a string that define a series of row/col definition in the form of ([min len)*,(gridlen value),(max len])*
                //ex:
                //Auto [100,2*,200] [,Auto,2000]
                //defines 3 row/col definition:
                //1) auto row/column
                //2) 2* row/column with min 100 pixel and max 200 pixel
                //3) Auto row/olumn with max 2000 pixel
                //TODO: use a regex instead
                value = value.trim();
                var tokens = value.split(" ");
                return Enumerable.From(tokens).Select(function (token) {
                    token = token.trim();
                    if (token.length == 0)
                        return;
                    if (token[0] == '[') {
                        //Case "[100,*,]" or "[,Auto,200]"
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
                        //case "*" or "Auto" or "12.3"
                        return {
                            length: GridLength.fromString(token)
                        };
                    }
                }).ToArray();
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
                _super.apply(this, arguments);
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
                //measure children full contained in auto and fixed size row/column (exclude only children that are fully contained in star w/h cells)
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
                        elements.forEach(function (el) { return el.measuredWidthFirstPass = true; }); //elements in this group can still be measured by the other dimension (width or height)
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
                        elements.forEach(function (el) { return el.measuredHeightFirstPass = true; }); //elements in this group can still be measured by the other dimension (width or height)
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
                //than get max of any auto/fixed measured row/column
                this._rowDefs.forEach(function (rowDef) {
                    if (!rowDef.isStar)
                        rowDef.elements.forEach(function (el) { return rowDef.desHeight = Math.max(rowDef.desHeight, el.element.desiredSize.height); });
                });
                this._columnDefs.forEach(function (columnDef) {
                    if (!columnDef.isStar)
                        columnDef.elements.forEach(function (el) { return columnDef.desWidth = Math.max(columnDef.desWidth, el.element.desiredSize.width); });
                });
                //now measure any fully contained star size row/column
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
                    //if size to content horizontally, star rows are treat just like auto rows (same apply to columns of course)
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
                //than adjust width and height to fit children that spans over columns or rows containing auto rows or auto columns
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
                //finally sum up the desidered size
                this._rowDefs.forEach(function (r) { return desideredSize.height += r.desHeight; });
                this._columnDefs.forEach(function (c) { return desideredSize.width += c.desWidth; });
                this._lastDesiredSize = desideredSize;
                return desideredSize;
            };
            Grid.prototype.arrangeOverride = function (finalSize) {
                var _this = this;
                //if finalSize != this.desideredSize we have to
                //to correct row/column with star values to take extra space or viceversa
                //remove space no more available from measure pass
                var xDiff = finalSize.width - this._lastDesiredSize.width;
                var yDiff = finalSize.height - this._lastDesiredSize.height;
                //rd.isStar/cd.isStar take in count also sizeToContent stuff
                //we need here only to know if column is star or not
                //this why we are using rd.row.height.isStar or cd.column.width.isStar
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
                    //rd.isStar takes in count also sizeToContent stuff
                    //we need here only to know if column is star or not
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
            Grid.typeName = "layouts.controls.Grid";
            ///Dependency properties
            //rows
            Grid.rowsProperty = layouts.DepObject.registerProperty(Grid.typeName, "Rows", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Grid.rowsFromString(v); });
            //columns
            Grid.columnsProperty = layouts.DepObject.registerProperty(Grid.typeName, "Columns", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Grid.columnsFromString(v); });
            //Grid.Row property
            Grid.rowProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#Row", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.fromString(v); });
            //Grid.Column property
            Grid.columnProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#Column", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.fromString(v); });
            //Grid.RowSpan property
            Grid.rowSpanProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#RowSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.spanFromString(v); });
            //Grid.ColumnSpan property
            Grid.columnSpanProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#ColumnSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.spanFromString(v); });
            return Grid;
        }(controls.Panel));
        controls.Grid = Grid;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var GridSplitter = (function (_super) {
            __extends(GridSplitter, _super);
            function GridSplitter() {
                var _this = this;
                _super.call(this);
                ///Grid splitter
                this._draggingCurrentPoint = new layouts.Vector();
                this._draggingStartPoint = new layouts.Vector();
                this._draggingVirtualOffset = new layouts.Vector();
                this._draggingVirtualOffsetMin = new layouts.Vector();
                this._draggingVirtualOffsetMax = new layouts.Vector();
                this.onSplitterMouseMove = function (ev) {
                    if (ev.buttons == 0) {
                        document.removeEventListener("mousemove", _this.onSplitterMouseMove, false);
                        document.removeEventListener("mouseup", _this.onSplitterMouseUp, false);
                    }
                    else
                        _this.moveGhost(ev);
                    ev.stopPropagation();
                };
                this.onSplitterMouseUp = function (ev) {
                    //if (ev.target == this._visual) {
                    _this.moveGhost(ev);
                    _this.dragSplitter(_this._draggingCurrentPoint.x, _this._draggingCurrentPoint.y);
                    //}
                    document.removeEventListener("mousemove", _this.onSplitterMouseMove, false);
                    document.removeEventListener("mouseup", _this.onSplitterMouseUp, false);
                    ev.stopPropagation();
                };
                layouts.FrameworkElement.classProperty.overrideDefaultValue(GridSplitter.typeName, "gridSplitter");
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
                this._visual.style.zIndex = "10000";
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
                //if element has no layout, returns
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
                    //register to mouse events
                    document.addEventListener("mousemove", this.onSplitterMouseMove, false);
                    document.addEventListener("mouseup", this.onSplitterMouseUp, false);
                    //calculate starting vectors and min/max values for _draggingCurrentPointX
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
                        var maxTopRowHeight = topRow.height.value + bottomRow.height.value; //parentGrid.actualHeight - parentGridFixedRowsHeight;
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
                        //console.log("topRow=", topRow.height.value);
                        //console.log("bottomRow=", bottomRow.height.value);
                        //parentGrid.rows.forEach((r, i) => {
                        //    console.log("row=", i);
                        //    console.log("height=", r.height.value);
                        //});
                        //console.log("_draggingStartPointY=", this._draggingStartPointY);
                        //console.log("ev.y=", ev.y);
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
                        //console.log("topRow=", topRow.height.value);
                        //console.log("bottomRow=", bottomRow.height.value);
                        //console.log("_draggingStartPointY=", this._draggingStartPointY);
                        //console.log("ev.y=", ev.y);
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
            GridSplitter.typeName = "layouts.controls.GridSplitter";
            return GridSplitter;
        }(controls.Border));
        controls.GridSplitter = GridSplitter;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        /// <summary>
        ///     Stretch - Enum which descibes how a source rect should be stretched to fit a 
        ///     destination rect.
        /// </summary>
        (function (Stretch) {
            /// <summary>
            ///     None - Preserve original size
            /// </summary>
            Stretch[Stretch["None"] = 0] = "None";
            /// <summary>
            ///     Fill - Aspect ratio is not preserved, source rect fills destination rect.
            /// </summary>
            Stretch[Stretch["Fill"] = 1] = "Fill";
            /// <summary>
            ///     Uniform - Aspect ratio is preserved, Source rect is uniformly scaled as large as 
            ///     possible such that both width and height fit within destination rect.  This will 
            ///     not cause source clipping, but it may result in unfilled areas of the destination 
            ///     rect, if the aspect ratio of source and destination are different.
            /// </summary>
            Stretch[Stretch["Uniform"] = 2] = "Uniform";
            /// <summary>
            ///     UniformToFill - Aspect ratio is preserved, Source rect is uniformly scaled as small 
            ///     as possible such that the entire destination rect is filled.  This can cause source 
            ///     clipping, if the aspect ratio of source and destination are different.
            /// </summary>
            Stretch[Stretch["UniformToFill"] = 3] = "UniformToFill";
        })(controls.Stretch || (controls.Stretch = {}));
        var Stretch = controls.Stretch;
        /// <summary>
        /// StretchDirection - Enum which describes when scaling should be used on the content of a Viewbox. This
        /// enum restricts the scaling factors along various axes.
        /// </summary>
        /// <seealso cref="Viewbox" />
        (function (StretchDirection) {
            /// <summary>
            /// Only scales the content upwards when the content is smaller than the Viewbox.
            /// If the content is larger, no scaling downwards is done.
            /// </summary>
            StretchDirection[StretchDirection["UpOnly"] = 0] = "UpOnly";
            /// <summary>
            /// Only scales the content downwards when the content is larger than the Viewbox.
            /// If the content is smaller, no scaling upwards is done.
            /// </summary>
            StretchDirection[StretchDirection["DownOnly"] = 1] = "DownOnly";
            /// <summary>
            /// Always stretches to fit the Viewbox according to the stretch mode.
            /// </summary>
            StretchDirection[StretchDirection["Both"] = 2] = "Both";
        })(controls.StretchDirection || (controls.StretchDirection = {}));
        var StretchDirection = controls.StretchDirection;
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image() {
                _super.apply(this, arguments);
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
            //protected measureOverride(constraint: Size): Size {
            //    var src = this.source;
            //    var mySize = new Size();
            //    var imgElement = this._imgElement;
            //    var srcChanged = (imgElement.src != src);
            //    if (srcChanged) {
            //        imgElement.src = src;
            //        imgElement.style.width = isFinite(constraint.width) ? constraint.width.toString() + "px" : "auto";
            //        imgElement.style.height = isFinite(constraint.height) ? constraint.height.toString() + "px" : "auto";
            //    }
            //    //if image is already loaded than report its size, otherwise the loaded event will invalidate my measure
            //    if (imgElement.complete &&
            //        imgElement.naturalWidth > 0) {
            //        var scaleFactor = Image.computeScaleFactor(constraint,
            //            new Size(imgElement.naturalWidth, imgElement.naturalHeight),
            //            this.stretch,
            //            this.stretchDirection);
            //        mySize = new Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
            //    }
            //    if (srcChanged && this.renderSize != null) {
            //        imgElement.style.width = this.renderSize.width.toString() + "px";
            //        imgElement.style.height = this.renderSize.height.toString() + "px";
            //    }            
            //    return mySize;
            //}
            //protected arrangeOverride(finalSize: Size): Size {
            //    var imgElement = this._imgElement;
            //    if (imgElement.complete &&
            //        imgElement.naturalWidth > 0) {
            //        var scaleFactor = Image.computeScaleFactor(finalSize,
            //            new Size(imgElement.naturalWidth, imgElement.naturalHeight),
            //            this.stretch,
            //            this.stretchDirection);
            //        return new Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
            //    }
            //    return finalSize;
            //}
            /// <summary>
            /// Helper function that computes scale factors depending on a target size and a content size
            /// </summary>
            /// <param name="availableSize">Size into which the content is being fitted.</param>
            /// <param name="contentSize">Size of the content, measured natively (unconstrained).</param>
            /// <param name="stretch">Value of the Stretch property on the element.</param>
            /// <param name="stretchDirection">Value of the StretchDirection property on the element.</param>
            Image.computeScaleFactor = function (availableSize, contentSize, stretch, stretchDirection) {
                // Compute scaling factors to use for axes
                var scaleX = 1.0;
                var scaleY = 1.0;
                var isConstrainedWidth = isFinite(availableSize.width);
                var isConstrainedHeight = isFinite(availableSize.height);
                if ((stretch == Stretch.Uniform || stretch == Stretch.UniformToFill || stretch == Stretch.Fill)
                    && (isConstrainedWidth || isConstrainedHeight)) {
                    // Compute scaling factors for both axes
                    scaleX = (contentSize.width.isCloseTo(0)) ? 0.0 : availableSize.width / contentSize.width;
                    scaleY = (contentSize.height.isCloseTo(0)) ? 0.0 : availableSize.height / contentSize.height;
                    if (!isConstrainedWidth)
                        scaleX = scaleY;
                    else if (!isConstrainedHeight)
                        scaleY = scaleX;
                    else {
                        // If not preserving aspect ratio, then just apply transform to fit
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
                    //Apply stretch direction by bounding scales.
                    //In the uniform case, scaleX=scaleY, so this sort of clamping will maintain aspect ratio
                    //In the uniform fill case, we have the same result too.
                    //In the fill case, note that we change aspect ratio, but that is okay
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
                //Return this as a size now
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
            Image.typeName = "layouts.controls.Image";
            Image.srcProperty = layouts.DepObject.registerProperty(Image.typeName, "Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Image.stretchProperty = layouts.DepObject.registerProperty(Image.typeName, "Stretch", Stretch.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Stretch[String(v)]; });
            Image.stretchDirectionProperty = layouts.DepObject.registerProperty(Image.typeName, "StretchDirection", StretchDirection.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return StretchDirection[String(v)]; });
            return Image;
        }(layouts.FrameworkElement));
        controls.Image = Image;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var MediaTemplateSelector = (function (_super) {
            __extends(MediaTemplateSelector, _super);
            function MediaTemplateSelector() {
                _super.apply(this, arguments);
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
            MediaTemplateSelector.typeName = "layouts.controls.MediaTemplateSelector";
            return MediaTemplateSelector;
        }(layouts.FrameworkElement));
        controls.MediaTemplateSelector = MediaTemplateSelector;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var div = (function (_super) {
            __extends(div, _super);
            function div() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(div.prototype, "typeName", {
                get: function () {
                    return div.typeName;
                },
                enumerable: true,
                configurable: true
            });
            //constructor(public tagName: string) {
            //    super();
            //}
            div.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = document.createElement("div");
                this._visual.innerHTML = this._innerXaml;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            div.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            div.prototype.measureOverride = function (constraint) {
                var pElement = this._visual;
                ;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            div.prototype.arrangeOverride = function (finalSize) {
                var pElement = this._visual;
                pElement.style.width = finalSize.width.toString() + "px";
                pElement.style.height = finalSize.height.toString() + "px";
                return finalSize;
            };
            div.typeName = "layouts.controls.div";
            return div;
        }(layouts.FrameworkElement));
        controls.div = div;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ItemsControl = (function (_super) {
            __extends(ItemsControl, _super);
            function ItemsControl() {
                _super.apply(this, arguments);
                //list of items created
                //note that in general this list is not 1:1 with itemssource collection
                //for example the case when some sort of virtualization of items is applied
                this._elements = null;
            }
            Object.defineProperty(ItemsControl.prototype, "typeName", {
                get: function () {
                    return ItemsControl.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.initProperties = function () {
                //FrameworkElement.overflowXProperty.overrideDefaultValue(ItemsControl.typeName, "auto");
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
                        //remove handler so that resource can be disposed
                        this._templates.offChangeNotify(this);
                    }
                    this._templates = value;
                    if (this._templates != null) {
                        this._templates.forEach(function (el) {
                            //to do: re-apply templates to children
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
                    //templates collection is changed
                    this.setupItems();
                }
                else if (collection == this.itemsSource) {
                    //some items were added/removed from itemssouurce
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
            //private getTemplateForItem(item: any): DataTemplate {
            //    if (this._templates == null ||
            //        this._templates.count == 0)
            //        return null;
            //    var typeName: string = typeof item;
            //    if (Ext.hasProperty(item, "typeName"))
            //        typeName = item["typeName"];
            //    else {
            //        if (item instanceof Date)//detect date type
            //            typeName = "date";
            //    }
            //    var foundTemplate: DataTemplate = null;
            //    if (typeName != null)
            //        foundTemplate = Enumerable.From(this.templates.elements).FirstOrDefault(null, dt => dt.targetType != null && dt.targetType.toLowerCase() == typeName.toLowerCase());
            //    if (foundTemplate != null)
            //        return foundTemplate;
            //    return Enumerable.From(this.templates.elements).FirstOrDefault(null, dt => dt.targetType == null);
            //}
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
                        Enumerable.From(elements).Select(function (item) {
                            var templateForItem = controls.DataTemplate.getTemplateForItem(_this._templates.toArray(), item);
                            if (templateForItem == null) {
                                throw new Error("Unable to find a valid template for item");
                            }
                            var newElement = templateForItem.createElement();
                            newElement.setValue(layouts.FrameworkElement.dataContextProperty, item);
                            return newElement;
                        }).ToArray();
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
            ItemsControl.typeName = "layouts.controls.ItemsControl";
            ItemsControl._init = ItemsControl.initProperties();
            //itemsSource property
            ItemsControl.itemsSourceProperty = layouts.DepObject.registerProperty(ItemsControl.typeName, "ItemsSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            //itemsPanel property
            ItemsControl.itemsPanelProperty = layouts.DepObject.registerProperty(ItemsControl.typeName, "ItemsPanel", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return ItemsControl;
        }(layouts.FrameworkElement));
        controls.ItemsControl = ItemsControl;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ComboBox = (function (_super) {
            __extends(ComboBox, _super);
            function ComboBox() {
                _super.apply(this, arguments);
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
                        this.selectedItem = Enumerable.From(this._elements).FirstOrDefault(null, function (_) { return _[_this.selectMember] == value; });
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
                    //point local _elements variable to itemsource cast
                    this._elements = elements;
                    var selectedItem = this.selectedItem;
                    if (this.selectMember != null) {
                        var selectedValue = this.selectedValue;
                        selectedItem = Enumerable.From(this._elements).FirstOrDefault(null, function (_) { return _[_this.selectMember] == selectedValue; });
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
                    //some items were added/removed from itemssouurce
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
                            //removeChild reset selected index to 0 if no item was selected, so restore previous selected index
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
            ComboBox.typeName = "layouts.controls.ComboBox";
            //itemsSource property
            ComboBox.itemsSourceProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "ItemsSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            //selectedItem property
            ComboBox.selectedItemProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectedItem", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            //displayMember property
            ComboBox.displayMemberProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "DisplayMember", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            //selectValue property
            ComboBox.selectedValueProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectedValue", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            //selectMember property
            ComboBox.selectMemberProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectMember", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return ComboBox;
        }(layouts.FrameworkElement));
        controls.ComboBox = ComboBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        /// <summary>
        /// Orientation indicates a direction of a control/layout that can exist in a horizontal or vertical state.
        /// Examples of these elements include: <see cref="Slider" /> and <see cref="Primitives.ScrollBar" />.
        /// </summary>
        (function (Orientation) {
            /// <summary>
            /// Control/Layout should be horizontally oriented.
            /// </summary>
            Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
            /// <summary>
            /// Control/Layout should be vertically oriented.
            /// </summary>
            Orientation[Orientation["Vertical"] = 1] = "Vertical";
        })(controls.Orientation || (controls.Orientation = {}));
        var Orientation = controls.Orientation;
        var Stack = (function (_super) {
            __extends(Stack, _super);
            function Stack() {
                _super.apply(this, arguments);
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
            Stack.typeName = "layouts.controls.Stack";
            Stack.orientationProperty = layouts.DepObject.registerProperty(Stack.typeName, "Orientation", Orientation.Vertical, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Orientation[String(v)]; });
            return Stack;
        }(controls.Panel));
        controls.Stack = Stack;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var TextBlock = (function (_super) {
            __extends(TextBlock, _super);
            function TextBlock() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(TextBlock.prototype, "typeName", {
                get: function () {
                    return TextBlock.typeName;
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._pElement = document.createElement("p");
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
            TextBlock.typeName = "layouts.controls.TextBlock";
            TextBlock.textProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
            TextBlock.whiteSpaceProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBlock.formatProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "Format", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
            return TextBlock;
        }(layouts.FrameworkElement));
        controls.TextBlock = TextBlock;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var TextBox = (function (_super) {
            __extends(TextBox, _super);
            function TextBox() {
                _super.apply(this, arguments);
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
                //layoutOverride above set style.width and styl.height
                //at that point browser compute new offsetWidth and offetHeight
                //we need to reset style.width/height so that textbox don't exceed space
                //that out parent has reserved for this control
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
                        this._measuredSize = null;
                    }
                }
                else if (property == TextBox.placeholderProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.placeholder = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == TextBox.typeProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.type = value;
                        this._measuredSize = null;
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
            TextBox.typeName = "layouts.controls.TextBox";
            TextBox.textProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBox.placeholderProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Placeholder", "", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBox.typeProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Type", "text", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBox.isReadonlyProperty = layouts.DepObject.registerProperty(TextBox.typeName, "IsReadonly", false);
            return TextBox;
        }(layouts.FrameworkElement));
        controls.TextBox = TextBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var DataTemplate = (function (_super) {
            __extends(DataTemplate, _super);
            function DataTemplate() {
                _super.apply(this, arguments);
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
            DataTemplate.getTemplateForItem = function (templates, item) {
                if (templates == null ||
                    templates.length == 0)
                    return null;
                var foundTemplate = Enumerable.From(templates).FirstOrDefault(null, function (template) {
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
                });
                if (foundTemplate != null)
                    return foundTemplate;
                return Enumerable.From(templates).FirstOrDefault(null, function (dt) { return dt.targetType == null; });
            };
            DataTemplate.getTemplateForMedia = function (templates) {
                if (templates == null ||
                    templates.length == 0)
                    return null;
                var foundTemplate = Enumerable.From(templates).FirstOrDefault(null, function (template) {
                    if (template.media == null ||
                        template.media.trim().length == 0) {
                        return true;
                    }
                    return window.matchMedia(template.media).matches;
                });
                if (foundTemplate != null)
                    return foundTemplate;
                return Enumerable.From(templates).FirstOrDefault(null, function (dt) { return dt.targetType == null; });
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
            DataTemplate.typeName = "layouts.controls.DataTemplate";
            ///returns the type datatemplate is suited for
            ///if null it means it's a generic template usable for any object of any type
            DataTemplate.targetTypeProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "TargetType", null);
            DataTemplate.targetMemberProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "TargetMember", null);
            DataTemplate.mediaProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "Media", null);
            return DataTemplate;
        }(layouts.DepObject));
        controls.DataTemplate = DataTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var UserControl = (function (_super) {
            __extends(UserControl, _super);
            function UserControl() {
                _super.apply(this, arguments);
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
                        //loader.namespaceResolver = (ns) => {
                        //    if (ns == "localViews")
                        //        return "app.views";
                        //    return null;
                        //};
                        _this.setupChild(loader.Parse(req.responseText));
                    }
                };
                //req.open("GET", "data/records.txt", true);
                //app.views.CustomView
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
                if (child != null)
                    child.arrange(finalSize.toRect());
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
            UserControl.typeName = "layouts.controls.UserControl";
            return UserControl;
        }(layouts.FrameworkElement));
        controls.UserControl = UserControl;
    })(controls = layouts.controls || (layouts.controls = {}));
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
            //return underling item list
            return this.elements;
        };
        ObservableCollection.prototype.add = function (element) {
            var _this = this;
            if (element == null)
                throw new Error("element null");
            var iElement = this.elements.indexOf(element);
            if (iElement == -1) {
                this.elements.push(element);
                //make a copy of handlers list before invoke functions
                //because this.pcHandlers could be modified by user code
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
                //make a copy of handlers list before invoke functions
                //because this.pcHandlers could be modified by user code
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
        //subscribe to collection changes
        ObservableCollection.prototype.onChangeNotify = function (handler) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        };
        //unsubscribe from collection changes
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
/// <reference path="IConverter.ts" />
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
            //resolve namespace to module/typename
            var ns = this.resolveNameSpace(xamlNode.namespaceURI);
            var typeName = ns != null ? ns + "." + xamlNode.localName : xamlNode.localName;
            //load object
            var containerObject = this.instanceLoader.getInstance(typeName);
            if (containerObject == null)
                throw new Error("Unable to create instance of '{0}'".format(typeName));
            //load properties objects defined by xml attributes
            if (xamlNode.attributes != null) {
                for (var i = 0; i < xamlNode.attributes.length; i++) {
                    var att = xamlNode.attributes[i];
                    var propertyName = att.localName;
                    if (!this.trySetProperty(containerObject, propertyName, this.resolveNameSpace(att.namespaceURI), att.value))
                        if (containerObject["addExtentedProperty"] != null)
                            containerObject["addExtentedProperty"](propertyName, att.value); //if no property with right name put it in extented properties collection
                    if (propertyName == "id")
                        this._createdObjectsWithId[att.value] = containerObject;
                }
            }
            var childrenProperties = Enumerable.From(xamlNode.childNodes).Where(function (_) { return _.nodeType == 1 && _.localName.indexOf(".") > -1; });
            childrenProperties.ForEach(function (childNode) {
                var indexOfDot = childNode.localName.indexOf(".");
                if (childNode.localName.substr(0, indexOfDot) == xamlNode.localName) {
                    var propertyName = childNode.localName.substr(indexOfDot + 1);
                    var childOfChild = Enumerable.From(childNode.childNodes).FirstOrDefault(null, function (_) { return _.nodeType == 1; });
                    var valueToSet = childOfChild == null ? null : _this.Load(childOfChild);
                    _this.trySetProperty(containerObject, propertyName, _this.resolveNameSpace(childNode.namespaceURI), valueToSet);
                }
            });
            var children = Enumerable.From(xamlNode.childNodes).Where(function (_) { return _.nodeType == 1 && _.localName.indexOf(".") == -1; });
            if (containerObject["setInnerXaml"] != null) {
                if (children.Count() > 0)
                    containerObject["setInnerXaml"]((new XMLSerializer()).serializeToString(children.ToArray()[0]));
                if (containerObject["setXamlLoader"] != null)
                    containerObject["setXamlLoader"](this);
                return containerObject;
            }
            if (children.Count() == 0)
                return containerObject; //no children
            //load children or content or items
            if (layouts.Ext.hasProperty(containerObject, "content") || layouts.Ext.hasProperty(containerObject, "child")) {
                //support direct content...try to set content of container object with first child
                //skip any other children of lml node
                var contentPropertyName = layouts.Ext.hasProperty(containerObject, "content") ? "content" : "child";
                containerObject[contentPropertyName] = this.Load(children.First());
            }
            else {
                var collectionPropertyName = null;
                if (layouts.Ext.hasProperty(containerObject, "children"))
                    collectionPropertyName = "children";
                if (layouts.Ext.hasProperty(containerObject, "items"))
                    collectionPropertyName = "items";
                if (layouts.Ext.hasProperty(containerObject, "templates"))
                    collectionPropertyName = "templates";
                if (collectionPropertyName != null) {
                    //if object has a property called Children or Items
                    //load all children from children nodes and set property with resulting list
                    var listOfChildren = children.Select(function (childNode) { return _this.Load(childNode); }).ToArray();
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
            var childrenLeft = Enumerable.From(nodeLeft.childNodes).Where(function (_) { return _.nodeType == 1; });
            var childrenRight = Enumerable.From(nodeRight.childNodes).Where(function (_) { return _.nodeType == 1; });
            if (childrenLeft.Count() != childrenRight.Count())
                return false;
            var arrayOfChildrenLeft = childrenLeft.ToArray();
            var arrayOfChildrenRight = childrenRight.ToArray();
            for (var i = 0; i < childrenLeft.Count(); i++) {
                var childNodeLeft = arrayOfChildrenLeft[i];
                var childNodeRight = arrayOfChildrenRight[i];
                if (!XamlReader.compareXml(childNodeLeft, childNodeRight))
                    return false;
            }
            return true;
        };
        XamlReader.prototype.trySetProperty = function (obj, propertyName, propertyNameSpace, value) {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;
            if (obj instanceof layouts.DepObject) {
                //if obj is a dependency object look for a dependency property 
                var depObject = obj;
                var typeName = depObject["typeName"];
                var depProperty;
                //if an attached property find the property on publisher object
                //for example if Grid.Row-> looks for property Grid#Row in Grid type
                var indexOfDot = propertyName.indexOf(".");
                if (indexOfDot > -1) {
                    typeName = propertyNameSpace == null ? propertyName.substr(0, indexOfDot) : propertyNameSpace + "." + propertyName.substr(0, indexOfDot);
                    propertyName = propertyName.replace(".", "#");
                    depProperty = layouts.DepObject.getProperty(typeName, propertyName);
                }
                else
                    depProperty = layouts.DepObject.lookupProperty(depObject, propertyName);
                if (depProperty != null) {
                    //ok we have a depProperty and a depObject
                    //test if value is actually a Binding object
                    var bindingDef = layouts.Ext.isString(value) ? XamlReader.tryParseBinding(value) : null;
                    if (bindingDef != null) {
                        //here I should check the source of binding (not yet implemented)
                        //by default if source == DataContext binding just connect to
                        //"DataContext." + original path and source is depObject itself
                        var converter = bindingDef.converter == null ? null : this.instanceLoader.getInstance(bindingDef.converter);
                        if (converter == null &&
                            bindingDef.converter != null)
                            throw new Error("Unable to create converter from '{0}'".format(bindingDef.converter));
                        //at moment we'll support only 2 modes:
                        //1) default -> connect to DataContext
                        //2) self -> connect to object itself
                        //3) {element} -> source is an element reference
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
            //walk up in class hierarchy to find a property with right name
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
                    //swallow error here because it could be simply a syntax error
                    //just signal it on console
                    console.log("[Bindings] Unable to parse '{0}' as binding definition".format(bindingValue));
                }
            }
            return null;
        };
        XamlReader.DefaultNamespace = "http://schemas.layouts.com/";
        return XamlReader;
    }());
    layouts.XamlReader = XamlReader;
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
//# sourceMappingURL=layouts.js.map