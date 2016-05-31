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
        DepObject.registerProperty = function (typeName, name, defaultValue, options, converter) {
            if (DepObject.globalPropertyMap[typeName] == null)
                DepObject.globalPropertyMap[typeName] = new layouts.PropertyMap();
            var newProperty = new layouts.DepProperty(name, defaultValue, options, converter);
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
            if (this.localPropertyValueMap[property.name] == null) {
                return property.getDefaultValue(this);
            }
            return this.localPropertyValueMap[property.name];
        };
        DepObject.prototype.setValue = function (property, value) {
            if (value != this.localPropertyValueMap[property.name]) {
                var valueToSet = property.converter != null && layouts.Ext.isString(value) ? property.converter(value) : value;
                var oldValue = this.localPropertyValueMap[property.name];
                this.localPropertyValueMap[property.name] = valueToSet;
                this.onDependencyPropertyChanged(property, valueToSet, oldValue);
            }
        };
        DepObject.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
            var _this = this;
            this.dpcHandlers.forEach(function (h) {
                h.onChangeDependencyProperty(_this, property, value);
            });
            this.bindings.forEach(function (b) {
                if (b.twoWay && b.targetProperty == property)
                    b.path.setValue(value);
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
        DepObject.prototype.bind = function (property, propertyPath, twoway, source, converter) {
            var newBinding = new Binding(this, property, propertyPath, source, twoway, converter);
            this.bindings.push(newBinding);
        };
        DepObject.globalPropertyMap = {};
        return DepObject;
    })();
    layouts.DepObject = DepObject;
    var Binding = (function () {
        function Binding(target, targetProperty, propertyPath, source, twoWay, converter) {
            if (twoWay === void 0) { twoWay = false; }
            if (converter === void 0) { converter = null; }
            this.twoWay = false;
            this.converter = null;
            this.target = target;
            this.targetProperty = targetProperty;
            this.path = new PropertyPath(this, propertyPath, source);
            this.twoWay = twoWay;
            this.converter = converter;
            this.updateTarget();
            if (this.twoWay)
                this.target.subscribeDependencyPropertyChanges(this);
        }
        Binding.prototype.updateTarget = function () {
            var retValue = this.path.getValue();
            if (retValue.success) {
                this.source = retValue.source;
                this.sourceProperty = retValue.sourceProperty;
                this.target.setValue(this.targetProperty, this.converter != null ? this.converter.convert(retValue.value, null) : retValue.value);
            }
        };
        Binding.prototype.onChangeDependencyProperty = function (depObject, depProperty, value) {
            if (depObject == this.target &&
                depProperty == this.targetProperty &&
                this.twoWay) {
                this.path.setValue(this.converter != null ? this.converter.convertBack(value, null) : value);
            }
        };
        return Binding;
    })();
    var PropertyPath = (function () {
        function PropertyPath(owner, path, source) {
            this.owner = owner;
            this.path = path;
            this.source = source;
            this.build();
            this.attachShource();
        }
        PropertyPath.prototype.attachShource = function () {
            if (this.sourceProperty == null)
                this.source.subscribePropertyChanges(this);
            else
                this.source.subscribeDependencyPropertyChanges(this);
        };
        PropertyPath.prototype.detachSource = function () {
            this.source.unsubscribePropertyChanges(this);
            this.source.unsubscribeDependencyPropertyChanges(this);
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
                    this.sourceProperty = DepObject.lookupProperty(this.source, this.name);
                    var sourcePropertyValue = (this.sourceProperty != null) ?
                        this.source.getValue(this.sourceProperty) :
                        this.source[this.name];
                    if (sourcePropertyValue != null) {
                        var nextPath = this.path.substring(dotIndex + 1);
                        if (this.next == null ||
                            this.next.path != nextPath ||
                            this.next.source != sourcePropertyValue)
                            this.next = new PropertyPath(this.owner, this.path.substring(dotIndex + 1), sourcePropertyValue);
                        else if (this.next != null)
                            this.next.build();
                    }
                    else
                        this.next = null;
                }
                else {
                    this.name = this.path;
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
            else if (this.name != null && this.path.indexOf(".") == -1)
                return {
                    success: true,
                    value: this.sourceProperty != null ? this.source.getValue(this.sourceProperty) : this.source[this.name],
                    source: this.source,
                    property: this.sourceProperty
                };
            else
                return {
                    success: false
                };
        };
        PropertyPath.prototype.setValue = function (value) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null && this.path.indexOf(".") == -1) {
                if (this.sourceProperty != null)
                    this.source.setValue(this.sourceProperty, value);
                else
                    this.source[this.name] = value;
            }
        };
        PropertyPath.prototype.onChangeDependencyProperty = function (depObject, depProperty, value) {
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
    })();
})(layouts || (layouts = {}));
