var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            this.relativeOffset = null;
            this.measureDirty = true;
            this.arrangeDirty = true;
            this.layoutInvalid = true;
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
            if (this._visual == null &&
                elementContainer != null)
                this.attachVisualOverride(elementContainer);
            if (this._visual == null &&
                elementContainer == null)
                this.attachVisualOverride(null);
            if (this._visual == null)
                return;
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
        };
        UIElement.prototype.attachVisualOverride = function (elementContainer) {
            var _this = this;
            if (this._visual == null)
                return;
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
        UIElement.classProperty = layouts.DepObject.registerProperty(UIElement.typeName, "class", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.idProperty = layouts.DepObject.registerProperty(UIElement.typeName, "id", layouts.Consts.stringEmpty, FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.commandProperty = layouts.DepObject.registerProperty(UIElement.typeName, "Command", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.commandParameterProperty = layouts.DepObject.registerProperty(UIElement.typeName, "CommandParameter", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.popupProperty = layouts.DepObject.registerProperty(UIElement.typeName, "Popup", null, FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.layoutUpdatedProperty = layouts.DepObject.registerProperty(UIElement.typeName, "LayoutUpdated", null, FrameworkPropertyMetadataOptions.None);
        return UIElement;
    }(layouts.DepObject));
    layouts.UIElement = UIElement;
})(layouts || (layouts = {}));
