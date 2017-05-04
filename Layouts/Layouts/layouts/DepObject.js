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
