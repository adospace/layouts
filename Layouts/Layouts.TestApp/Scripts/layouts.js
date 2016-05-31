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
Object.prototype.getTypeName = function () {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((this).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
};
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
})();
var layouts;
(function (layouts) {
    var LayoutManager = (function () {
        function LayoutManager() {
        }
        LayoutManager.requestLayoutUpdate = function () {
            requestAnimationFrame(LayoutManager.updateLayout);
        };
        LayoutManager.updateLayout = function () {
            var page = layouts.Application.current.page;
            if (page != null) {
                var sizeToContentWidth = page.SizeToContent == layouts.controls.SizeToContent.Both || page.SizeToContent == layouts.controls.SizeToContent.Horizontal;
                var sizeToContentHeight = page.SizeToContent == layouts.controls.SizeToContent.Both || page.SizeToContent == layouts.controls.SizeToContent.Vertical;
                var docWidth = document.body.clientWidth;
                var docHeight = document.body.clientHeight;
                page.measure(new layouts.Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                page.arrange(new layouts.Rect(0, 0, sizeToContentWidth ? page.desideredSize.width : docWidth, sizeToContentHeight ? page.desideredSize.height : docHeight));
                page.layout();
            }
            requestAnimationFrame(LayoutManager.updateLayout);
        };
        return LayoutManager;
    })();
    layouts.LayoutManager = LayoutManager;
    window.onresize = function () {
        LayoutManager.updateLayout();
    };
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var DepProperty = (function () {
        function DepProperty(name, defaultValue, options) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (options === void 0) { options = null; }
            this.name = name;
            this.defaultValue = defaultValue;
            this.options = options;
        }
        return DepProperty;
    })();
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
        PropertyMap.prototype.register = function (name, property) {
            if (this.propertyMap[name] != null)
                throw new Error("property already registered");
            this.propertyMap[name] = property;
        };
        return PropertyMap;
    })();
    layouts.PropertyMap = PropertyMap;
})(layouts || (layouts = {}));
/// <reference path="DepProperty.ts" />
/// <reference path="PropertyMap.ts" />
var layouts;
(function (layouts) {
    var DepObject = (function () {
        function DepObject() {
            ///Returns the type name of object
            this.internalTypeName = null;
            this.localPropertyValueMap = {};
            this.pcHandlers = [];
            this.bindings = new Array();
            this.pathBindings = new Array();
        }
        ///Register a dependency property for the object
        DepObject.prototype.registerProperty = function (name, defaultValue, options) {
            if (DepObject.globalPropertyMap[this.typeName] == null)
                DepObject.globalPropertyMap[this.typeName] = new layouts.PropertyMap();
            var newProperty = new layouts.DepProperty(name, defaultValue, options);
            DepObject.globalPropertyMap[this.typeName].register(name, newProperty);
            return newProperty;
        };
        Object.defineProperty(DepObject.prototype, "typeName", {
            get: function () {
                if (this.internalTypeName == null)
                    this.internalTypeName = this.getTypeName();
                return this.internalTypeName;
            },
            enumerable: true,
            configurable: true
        });
        ///Get the dependency property registered with this type of object
        DepObject.getProperty = function (typeName, name) {
            return DepObject.globalPropertyMap[typeName].getProperty(name);
        };
        //Get property value for this object
        DepObject.prototype.getValue = function (property) {
            if (this.localPropertyValueMap[property.name] == null)
                return property.defaultValue;
            return this.localPropertyValueMap[property.name];
        };
        //set property value to this object
        DepObject.prototype.setValue = function (property, value) {
            if (value != this.localPropertyValueMap[property.name]) {
                this.localPropertyValueMap[property.name] = value;
                this.onPropertyChanged(property, value);
            }
        };
        //Called when a value of a dependency is changed (manually or by a binding)
        DepObject.prototype.onPropertyChanged = function (property, value) {
            var _this = this;
            this.pcHandlers.forEach(function (h) {
                h(_this, property, value);
            });
            this.bindings.forEach(function (b) {
                if (b.twoWay && b.targetProperty == property)
                    b.path.setValue(value); //update source if two way binding
            });
        };
        //subscribe to property change events
        DepObject.prototype.subscribePropertyChanges = function (handler) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        };
        //unsubscribe from property change events
        DepObject.prototype.unsubscribePropertyChanges = function (handler) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        };
        //bind a property of this object to a source object thru a path
        DepObject.prototype.bind = function (property, propertyPath, source) {
            var newBinding = new layouts.Binding(this, property, new layouts.PropertyPath(propertyPath, source));
            this.bindings.push(newBinding);
            return newBinding;
        };
        ///Map of properties for each dependency object
        DepObject.globalPropertyMap = {};
        return DepObject;
    })();
    layouts.DepObject = DepObject;
})(layouts || (layouts = {}));
/// <reference path="DepProperty.ts" />
/// <reference path="DepObject.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
        return Size;
    })();
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
            get: function () { return new Size(this.width, this.height); },
            enumerable: true,
            configurable: true
        });
        return Rect;
    })();
    layouts.Rect = Rect;
    var Vector = (function () {
        function Vector(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return Vector;
    })();
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
    var UIElement = (function (_super) {
        __extends(UIElement, _super);
        function UIElement() {
            _super.apply(this, arguments);
            this.measureDirty = true;
            this.arrangeDirty = true;
            this.layoutInvalid = true;
        }
        UIElement.prototype.measure = function (availableSize) {
            if (!this.isVisible) {
                this.desideredSize = new Size();
                return;
            }
            var isCloseToPreviousMeasure = this.previousAvailableSize == null ? false : availableSize.width.isCloseTo(this.previousAvailableSize.width) &&
                availableSize.height.isCloseTo(this.previousAvailableSize.height);
            if (!this.measureDirty && isCloseToPreviousMeasure)
                return;
            this.previousAvailableSize = availableSize;
            this.desideredSize = this.measureCore(availableSize);
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
        ///Render Pass
        UIElement.prototype.layout = function () {
            if (this.layoutInvalid) {
                this.layoutOverride();
                this.layoutInvalid = false;
            }
        };
        UIElement.prototype.layoutOverride = function () {
        };
        UIElement.prototype.attachVisual = function (elementContainer) {
            if (elementContainer != null &&
                this._visual != null &&
                this._visual.parentElement != null &&
                this._visual.parentElement != elementContainer)
                this._visual.parentElement.removeChild(this._visual);
            if (this._visual == null) {
                this.attachVisualOverride(elementContainer);
                elementContainer.appendChild(this._visual);
            }
        };
        UIElement.prototype.attachVisualOverride = function (elementContainer) {
        };
        UIElement.prototype.onPropertyChanged = function (property, value) {
            var options = property.options;
            if (options != null) {
                if ((options & FrameworkPropertyMetadataOptions.AffectsMeasure) != 0)
                    this.invalidateMeasure();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsArrange) != 0)
                    this.invalidateArrange();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsParentMeasure) != 0 && this._parent != null)
                    this._parent.invalidateMeasure();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsParentArrange) != 0 && this._parent != null)
                    this._parent.invalidateArrange();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsRender) != 0)
                    this.invalidateLayout();
            }
        };
        UIElement.prototype.getValue = function (property) {
            if (this.localPropertyValueMap[property.name] == null) {
                var options = property.options;
                if (options != null &&
                    parent != null &&
                    (options & FrameworkPropertyMetadataOptions.Inherits) != 0) {
                    //search property on parent
                    return this._parent.getValue(property);
                }
                //get default
                return property.defaultValue;
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
        Object.defineProperty(UIElement.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (newParent) {
                if (this._parent != newParent) {
                    var oldParent = this._parent;
                    this._parent = newParent;
                    this.onParentChanged(oldParent, newParent);
                }
            },
            enumerable: true,
            configurable: true
        });
        UIElement.prototype.onParentChanged = function (oldParent, newParent) {
        };
        Object.defineProperty(UIElement.prototype, "isVisible", {
            get: function () {
                return _super.prototype.getValue.call(this, UIElement.isVisibleProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, UIElement.isVisibleProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "cssStyle", {
            get: function () {
                return _super.prototype.getValue.call(this, UIElement.styleProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, UIElement.styleProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIElement.prototype, "cssClass", {
            get: function () {
                return _super.prototype.getValue.call(this, UIElement.classProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, UIElement.classProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        UIElement.isVisibleProperty = (new UIElement()).registerProperty("IsVisible", true, FrameworkPropertyMetadataOptions.AffectsParentMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.styleProperty = (new UIElement()).registerProperty("cssStyle", "", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        UIElement.classProperty = (new UIElement()).registerProperty("cssClass", "", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        return UIElement;
    })(layouts.DepObject);
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
        return Thickness;
    })();
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
    })();
    var FrameworkElement = (function (_super) {
        __extends(FrameworkElement, _super);
        function FrameworkElement() {
            _super.apply(this, arguments);
            this.visualOffset = new layouts.Vector();
        }
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
            var clipped = false;
            if (desideredSize.width > mm.maxWidth) {
                desideredSize.width = mm.maxWidth;
                clipped = true;
            }
            if (desideredSize.height > mm.maxHeight) {
                desideredSize.height = mm.maxHeight;
                clipped = true;
            }
            var clippedDesiredWidth = desideredSize.width + marginWidth;
            var clippedDesiredHeight = desideredSize.height + marginHeight;
            if (clippedDesiredWidth > availableSize.width) {
                clippedDesiredWidth = availableSize.width;
                clipped = true;
            }
            if (clippedDesiredHeight > availableSize.height) {
                clippedDesiredHeight = availableSize.height;
                clipped = true;
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
            this.needClipBounds = false;
            if (arrangeSize.width.isCloseTo(this.unclippedDesiredSize.width) ||
                arrangeSize.width < this.unclippedDesiredSize.width) {
                this.needClipBounds = true;
                arrangeSize.width = this.unclippedDesiredSize.width;
            }
            if (arrangeSize.height.isCloseTo(this.unclippedDesiredSize.height) ||
                arrangeSize.height < this.unclippedDesiredSize.height) {
                this.needClipBounds = true;
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
                this.needClipBounds = true;
                arrangeSize.width = effectiveMaxWidth;
            }
            var effectiveMaxHeight = Math.max(this.unclippedDesiredSize.height, mm.maxHeight);
            if (effectiveMaxHeight.isCloseTo(arrangeSize.height) ||
                effectiveMaxHeight < arrangeSize.height) {
                this.needClipBounds = true;
                arrangeSize.height = effectiveMaxHeight;
            }
            var oldRenderSize = this.renderSize;
            var innerInkSize = this.arrangeOverride(arrangeSize);
            this.renderSize = innerInkSize;
            this.setActualWidth(innerInkSize.width);
            this.setActualHeight(innerInkSize.height);
            var clippedInkSize = new layouts.Size(Math.min(innerInkSize.width, mm.maxWidth), Math.min(innerInkSize.height, mm.maxHeight));
            this.needClipBounds = this.needClipBounds ||
                clippedInkSize.width.isCloseTo(innerInkSize.width) || clippedInkSize.width < innerInkSize.width ||
                clippedInkSize.height.isCloseTo(innerInkSize.height) || clippedInkSize.height < innerInkSize.height;
            var clientSize = new layouts.Size(Math.max(0, finalRect.width - marginWidth), Math.max(0, finalRect.height - marginHeight));
            this.needClipBounds = this.needClipBounds ||
                clientSize.width.isCloseTo(clippedInkSize.width) || clientSize.width < clippedInkSize.width ||
                clientSize.height.isCloseTo(clippedInkSize.height) || clientSize.height < clippedInkSize.height;
            var offset = this.computeAlignmentOffset(clientSize, clippedInkSize);
            offset.x += finalRect.x + margin.left;
            offset.y += finalRect.y + margin.top;
            var oldOffset = this.visualOffset;
            if (!oldOffset.x.isCloseTo(offset.x) ||
                !oldOffset.y.isCloseTo(offset.y)) {
                this.visualOffset = offset;
            }
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
            var name = this.name;
            if (this._visual.id != name)
                this._visual.id = name;
            var className = this.cssClass;
            if (this._visual.className != className)
                this._visual.className = className;
            this._visual.style.cssText = this.cssStyle;
            this._visual.style.position = "absolute";
            this._visual.style.visibility = this.isVisible ? "visible" : "collapsed";
            this._visual.style.top = this.visualOffset.y.toString() + "px";
            this._visual.style.left = this.visualOffset.x.toString() + "px";
            this._visual.style.width = this.renderSize.width.toString() + "px";
            this._visual.style.height = this.renderSize.height.toString() + "px";
        };
        FrameworkElement.prototype.attachVisualOverride = function (elementContainer) {
            this._visual.style.position = "absolute";
        };
        Object.defineProperty(FrameworkElement.prototype, "width", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.widthProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.widthProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "height", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.heightProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.heightProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "actualWidth", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.actualWidthProperty);
            },
            enumerable: true,
            configurable: true
        });
        FrameworkElement.prototype.setActualWidth = function (value) {
            _super.prototype.setValue.call(this, FrameworkElement.actualWidthProperty, value);
        };
        Object.defineProperty(FrameworkElement.prototype, "actualHeight", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.actualHeightProperty);
            },
            enumerable: true,
            configurable: true
        });
        FrameworkElement.prototype.setActualHeight = function (value) {
            _super.prototype.setValue.call(this, FrameworkElement.actualHeightProperty, value);
        };
        Object.defineProperty(FrameworkElement.prototype, "minWidth", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.minWidthProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.minWidthProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "minHeight", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.minHeightProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.minHeightProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "maxWidth", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.maxWidthProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.maxWidthProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "maxHeight", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.maxHeightProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.maxHeightProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "verticalAlignment", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.verticalAlignmentProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.verticalAlignmentProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "horizontalAlignment", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.horizontalAlignmentProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.horizontalAlignmentProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "margin", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.marginProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.marginProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "dataContext", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.dataContextProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.dataContextProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "name", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.nameProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.nameProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameworkElement.prototype, "tag", {
            get: function () {
                return _super.prototype.getValue.call(this, FrameworkElement.tagProperty);
            },
            set: function (value) {
                _super.prototype.setValue.call(this, FrameworkElement.tagProperty, value);
            },
            enumerable: true,
            configurable: true
        });
        //width property
        FrameworkElement.widthProperty = (new FrameworkElement()).registerProperty("Width", Number.NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //height property
        FrameworkElement.heightProperty = (new FrameworkElement()).registerProperty("Height", Number.NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //actualWidth property
        FrameworkElement.actualWidthProperty = (new FrameworkElement()).registerProperty("ActualWidth", 0);
        //actualHeight property
        FrameworkElement.actualHeightProperty = (new FrameworkElement()).registerProperty("ActualHeight", 0);
        //minWidth property
        FrameworkElement.minWidthProperty = (new FrameworkElement()).registerProperty("MinWidth", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //minHeight property
        FrameworkElement.minHeightProperty = (new FrameworkElement()).registerProperty("MinHeight", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //maxWidth property
        FrameworkElement.maxWidthProperty = (new FrameworkElement()).registerProperty("MaxWidth", Infinity, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //maxHeight property
        FrameworkElement.maxHeightProperty = (new FrameworkElement()).registerProperty("MaxHeight", Infinity, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //verticalAlignment property
        FrameworkElement.verticalAlignmentProperty = (new FrameworkElement()).registerProperty("VerticalAlignment", VerticalAlignment.Stretch, layouts.FrameworkPropertyMetadataOptions.AffectsArrange);
        //horizontalAlignment property
        FrameworkElement.horizontalAlignmentProperty = (new FrameworkElement()).registerProperty("HorizontalAlignment", HorizontalAlignment.Stretch, layouts.FrameworkPropertyMetadataOptions.AffectsArrange);
        //margin property
        FrameworkElement.marginProperty = (new FrameworkElement()).registerProperty("Margin", new Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
        //dataContext property
        FrameworkElement.dataContextProperty = (new FrameworkElement()).registerProperty("DataContext", null, layouts.FrameworkPropertyMetadataOptions.Inherits);
        //name property
        FrameworkElement.nameProperty = (new FrameworkElement()).registerProperty("Name", "", layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        //tag property
        FrameworkElement.tagProperty = (new FrameworkElement()).registerProperty("Tag");
        return FrameworkElement;
    })(layouts.UIElement);
    layouts.FrameworkElement = FrameworkElement;
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        (function (SizeToContent) {
            SizeToContent[SizeToContent["None"] = 0] = "None";
            SizeToContent[SizeToContent["Both"] = 1] = "Both";
            SizeToContent[SizeToContent["Vertical"] = 2] = "Vertical";
            SizeToContent[SizeToContent["Horizontal"] = 3] = "Horizontal";
        })(controls.SizeToContent || (controls.SizeToContent = {}));
        var SizeToContent = controls.SizeToContent;
        var Page = (function (_super) {
            __extends(Page, _super);
            function Page() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Page.prototype, "Child", {
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
                            this._child.attachVisual(document.body);
                        }
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Page.prototype.layoutOverride = function () {
                if (this._child != null)
                    this._child.layout();
            };
            Page.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                if (this._child != null) {
                    this._child.measure(constraint);
                    return this._child.desideredSize;
                }
                return mySize;
            };
            Page.prototype.arrangeOverride = function (finalSize) {
                //  arrange child
                var child = this._child;
                if (child != null) {
                    child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                }
                return finalSize;
            };
            Object.defineProperty(Page.prototype, "SizeToContent", {
                get: function () {
                    return _super.prototype.getValue.call(this, Page.sizeToContentProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Page.sizeToContentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Page.sizeToContentProperty = (new Page()).registerProperty("SizeToContent", SizeToContent.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Page;
        })(layouts.FrameworkElement);
        controls.Page = Page;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="Extensions.ts" />
/// <reference path="LayoutManager.ts" />
/// <reference path="Controls\Page.ts" />
var layouts;
(function (layouts) {
    var Application = (function () {
        function Application() {
            Application._current = this;
        }
        Object.defineProperty(Application, "current", {
            //get current application
            get: function () {
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
                    this._page = page;
                    layouts.LayoutManager.requestLayoutUpdate();
                }
            },
            enumerable: true,
            configurable: true
        });
        return Application;
    })();
    layouts.Application = Application;
})(layouts || (layouts = {}));
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
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
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
        })();
        controls.CornerRadius = CornerRadius;
        var Border = (function (_super) {
            __extends(Border, _super);
            function Border() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Border.prototype, "Child", {
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
                    var childSize = this._child.desideredSize;
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
                var borderBrush = this.borderBrush;
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
                var background = this.background;
                if (this._visual.style.background != background)
                    this._visual.style.background = background;
                if (this._child != null)
                    this._child.layout();
            };
            Object.defineProperty(Border.prototype, "borderThickness", {
                get: function () {
                    return _super.prototype.getValue.call(this, Border.borderThicknessProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Border.borderThicknessProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "padding", {
                get: function () {
                    return _super.prototype.getValue.call(this, Border.paddingProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Border.paddingProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "background", {
                get: function () {
                    return _super.prototype.getValue.call(this, Border.backgroundProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Border.backgroundProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Border.prototype, "borderBrush", {
                get: function () {
                    return _super.prototype.getValue.call(this, Border.borderBrushProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Border.borderBrushProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Border.borderThicknessProperty = (new Border()).registerProperty("BorderThickness", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.paddingProperty = (new Border()).registerProperty("Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.backgroundProperty = (new Border()).registerProperty("Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.borderBrushProperty = (new Border()).registerProperty("BorderBrush", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Border;
        })(layouts.FrameworkElement);
        controls.Border = Border;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Button.prototype, "Child", {
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
                if (this._child != null) {
                    this._child.attachVisual(this._buttonElement);
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Button.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                // Compute the chrome size added by padding
                var padding = new layouts.Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
                //If we have a child
                if (this._child != null) {
                    // Remove size of padding only from child's reference size.
                    var childConstraint = new layouts.Size(Math.max(0.0, constraint.width - padding.width), Math.max(0.0, constraint.height - padding.height));
                    this._child.measure(childConstraint);
                    var childSize = this._child.desideredSize;
                    // Now use the returned size to drive our size, by adding back the margins, etc.
                    mySize.width = childSize.width + padding.width;
                    mySize.height = childSize.height + padding.height;
                }
                else if (this.text != null) {
                    var text = this.text;
                    var mySize = new layouts.Size();
                    var pElement = this._buttonElement;
                    var txtChanged = (pElement.innerText != text);
                    if (isFinite(constraint.width))
                        pElement.style.maxWidth = constraint.width + "px";
                    if (isFinite(constraint.height))
                        pElement.style.maxHeight = constraint.height + "px";
                    pElement.style.width = "auto";
                    pElement.style.height = "auto";
                    if (txtChanged) {
                        pElement.innerHTML = this.text;
                    }
                    mySize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                    if (txtChanged && this.renderSize != null) {
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
            Object.defineProperty(Button.prototype, "padding", {
                get: function () {
                    return _super.prototype.getValue.call(this, Button.paddingProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Button.paddingProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "text", {
                get: function () {
                    return _super.prototype.getValue.call(this, Button.textProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Button.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            //Dependency properties
            Button.paddingProperty = (new Button()).registerProperty("Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.textProperty = (new Button()).registerProperty("Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Button;
        })(layouts.FrameworkElement);
        controls.Button = Button;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Panel.prototype, "Children", {
                get: function () {
                    if (this._children == null) {
                        this._children = new layouts.ObservableCollection();
                        this._children.on(this.childrenCollectionChanged);
                    }
                    return this._children.toArray();
                },
                set: function (value) {
                    if (value == this._children.toArray())
                        return;
                    var self = this;
                    if (this._children != null) {
                        //reset parent on all children
                        this._children.forEach(function (el) {
                            if (el.parent == self)
                                el.parent = null;
                        });
                        //remove handler so that resource can be disposed
                        this._children.off(this.childrenCollectionChanged);
                    }
                    this._children = new layouts.ObservableCollection(value);
                    //attach new children here
                    this._children.forEach(function (el) {
                        if (el.parent != null) {
                            //if already child of a different parent throw error
                            //in future investigate if it can be removed from container automatically
                            throw new Error("Element already child of another element, please remove it first from previous container");
                        }
                        el.parent = self;
                        if (self._divElement != null)
                            el.attachVisual(self._divElement);
                    });
                    this._children.on(this.childrenCollectionChanged);
                },
                enumerable: true,
                configurable: true
            });
            Panel.prototype.childrenCollectionChanged = function (collection, added, removed) {
                var self = this;
                removed.forEach(function (el) {
                    if (el.parent == self)
                        el.parent = null;
                });
                added.forEach(function (el) {
                    el.parent = self;
                    if (self._divElement != null)
                        el.attachVisual(self._divElement);
                });
                this.invalidateMeasure();
            };
            Panel.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var background = this.background;
                if (this._visual.style.background != background)
                    this._visual.style.background = background;
                this._children.forEach(function (child) { return child.layout(); });
            };
            Panel.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._divElement = document.createElement("div");
                var self = this;
                this._children.forEach(function (child) { return child.attachVisual(self._divElement); });
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Object.defineProperty(Panel.prototype, "background", {
                get: function () {
                    return _super.prototype.getValue.call(this, Panel.backgroundProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Panel.backgroundProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Panel.prototype, "isItemsHost", {
                get: function () {
                    return _super.prototype.getValue.call(this, Panel.isItemsHostProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Panel.isItemsHostProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Panel.backgroundProperty = (new Panel()).registerProperty("Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Panel.isItemsHostProperty = (new Panel()).registerProperty("IsItemsHost", false, layouts.FrameworkPropertyMetadataOptions.NotDataBindable);
            return Panel;
        })(layouts.FrameworkElement);
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
                this._value = value;
                this._type = type;
            }
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
        })();
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
        })();
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
        })();
        controls.GridColumn = GridColumn;
        var RowDef = (function () {
            function RowDef(row, vSizeToContent) {
                this.row = row;
                this.availHeight = Infinity;
                this._desHeight = 0;
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
        })();
        var ColumnDef = (function () {
            function ColumnDef(column, hSizeToContent) {
                this.column = column;
                this.availWidth = Infinity;
                this._desWidth = 0;
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
        })();
        var ElementDef = (function () {
            function ElementDef(element, row, column, rowSpan, columnSpan) {
                this.element = element;
                this.row = row;
                this.column = column;
                this.rowSpan = rowSpan;
                this.columnSpan = columnSpan;
                this.availWidth = Infinity;
                this.availHeight = Infinity;
                this.desWidth = NaN;
                this.desHeight = NaN;
                this.cellTopOffset = 0;
                this.cellLeftOffset = 0;
            }
            return ElementDef;
        })();
        var Grid = (function (_super) {
            __extends(Grid, _super);
            function Grid() {
                _super.apply(this, arguments);
            }
            Grid.prototype.measureOverride = function (constraint) {
                var _this = this;
                var desideredSize = new layouts.Size();
                var hSizeToContent = !isFinite(constraint.width);
                var vSizeToContent = !isFinite(constraint.height);
                this.rowDefs = new Array(Math.max(this.rows.count, 1));
                this.columnDefs = new Array(Math.max(this.columns.count, 1));
                this.elementDefs = new Array(this.Children.length);
                if (this._rows.count > 0)
                    this._rows.forEach(function (row, i) { return _this.rowDefs[i] = new RowDef(row, vSizeToContent); });
                else
                    this.rowDefs[0] = new RowDef(new GridRow(new GridLength(1, GridUnitType.Star)), vSizeToContent);
                if (this._columns.count > 0)
                    this._columns.forEach(function (column, i) { return _this.columnDefs[i] = new ColumnDef(column, hSizeToContent); });
                else
                    this.columnDefs[0] = new ColumnDef(new GridColumn(new GridLength(1, GridUnitType.Star)), hSizeToContent);
                for (var iElement = 0; iElement < this.Children.length; iElement++) {
                    var child = this.Children[iElement];
                    var elRow = Grid.getRow(child).minMax(0, this.rowDefs.length);
                    var elColumn = Grid.getColumn(child).minMax(0, this.columnDefs.length);
                    var elRowSpan = Grid.getRowSpan(child).minMax(1, this.rowDefs.length - elRow);
                    var elColumnSpan = Grid.getColumnSpan(child).minMax(1, this.columnDefs.length - elColumn);
                    this.elementDefs[iElement] = new ElementDef(child, elRow, elColumn, elRowSpan, elColumnSpan);
                    if (elRowSpan == 1)
                        this.rowDefs[elRow].elements.push(this.elementDefs[iElement]);
                    if (elColumnSpan == 1)
                        this.columnDefs[elColumn].elements.push(this.elementDefs[iElement]);
                }
                //measure children full contained auto and fixed size in any row/column (exclude only children that are fully contained in star w/h cells)
                for (var iRow = 0; iRow < this.rowDefs.length; iRow++) {
                    var rowDef = this.rowDefs[iRow];
                    var elements = rowDef.elements;
                    if (rowDef.isAuto) {
                        elements.forEach(function (el) { return el.availHeight = Infinity; });
                    }
                    else if (rowDef.isFixed) {
                        rowDef.desHeight = rowDef.row.height.value;
                        elements.forEach(function (el) { return el.availHeight = rowDef.desHeight; });
                    }
                    else {
                        elements.forEach(function (el) { return el.measuredWidthFirstPass = true; }); //elements in this group can still be measured by the other dimension (width or height)
                    }
                }
                for (var iColumn = 0; iColumn < this.columnDefs.length; iColumn++) {
                    var columnDef = this.columnDefs[iColumn];
                    var elements = columnDef.elements;
                    if (columnDef.isAuto) {
                        elements.forEach(function (el) { return el.availWidth = +Infinity; });
                    }
                    else if (columnDef.isFixed) {
                        columnDef.desWidth = columnDef.column.width.value;
                        this.rowDefs[iColumn].elements.forEach(function (el) { return el.availWidth = columnDef.desWidth; });
                    }
                    else {
                        elements.forEach(function (el) { return el.measuredHeightFirstPass = true; }); //elements in this group can still be measured by the other dimension (width or height)
                    }
                }
                this.elementDefs.forEach(function (el) {
                    if (!el.measuredHeightFirstPass ||
                        !el.measuredWidthFirstPass) {
                        el.element.measure(new layouts.Size(el.availWidth, el.availHeight));
                        if (isNaN(el.desWidth))
                            el.desWidth = el.element.desideredSize.width;
                        if (isNaN(el.desHeight))
                            el.desHeight = el.element.desideredSize.height;
                    }
                    el.measuredWidthFirstPass = el.measuredHeightFirstPass = true;
                });
                //than get max of any auto/fixed measured row/column
                this.rowDefs.forEach(function (rowDef) {
                    if (!rowDef.isStar)
                        rowDef.elements.forEach(function (el) { return rowDef.desHeight = Math.max(rowDef.desHeight, el.element.desideredSize.height); });
                });
                this.columnDefs.forEach(function (columnDef) {
                    if (!columnDef.isStar)
                        columnDef.elements.forEach(function (el) { return columnDef.desWidth = Math.max(columnDef.desWidth, el.element.desideredSize.width); });
                });
                //than adjust width and height to fit children that spans over columns or rows containing auto rows or auto columns
                for (var iElement = 0; iElement < this.elementDefs.length; iElement++) {
                    var elementDef = this.elementDefs[iElement];
                    if (elementDef.rowSpan > 1) {
                        var concatHeight = 0;
                        this.elementDefs.slice(elementDef.row, elementDef.row + elementDef.rowSpan).forEach(function (el) { return concatHeight += el.desHeight; });
                        if (concatHeight < elementDef.desHeight) {
                            var diff = elementDef.desHeight - concatHeight;
                            var autoRows = this.rowDefs.filter(function (r) { return r.isAuto; });
                            if (autoRows.length > 0) {
                                autoRows.forEach(function (c) { return c.desHeight += diff / autoRows.length; });
                            }
                            else {
                                var starRows = this.rowDefs.filter(function (r) { return r.isStar; });
                                if (starRows.length > 0) {
                                    starRows.forEach(function (c) { return c.desHeight += diff / autoColumns.length; });
                                }
                            }
                        }
                        else if (concatHeight > elementDef.desHeight) {
                            elementDef.cellTopOffset = (concatHeight - elementDef.desHeight) / 2;
                        }
                    }
                    if (elementDef.columnSpan > 1) {
                        var concatWidth = 0;
                        this.elementDefs.slice(elementDef.column, elementDef.column + elementDef.columnSpan).forEach(function (el) { return concatWidth += el.desWidth; });
                        if (concatWidth < elementDef.desWidth) {
                            var diff = elementDef.desWidth - concatWidth;
                            var autoColumns = this.columnDefs.filter(function (c) { return c.isAuto; });
                            if (autoColumns.length > 0) {
                                autoColumns.forEach(function (c) { return c.desWidth += diff / autoColumns.length; });
                            }
                            else {
                                var starColumns = this.columnDefs.filter(function (c) { return c.isStar; });
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
                //now measure any full contained star size row/column
                var elementToMeasure = [];
                var notStarRowsHeight = 0;
                this.rowDefs.forEach(function (r) { return notStarRowsHeight += r.desHeight; });
                var sumRowStars = 0;
                this.rowDefs.forEach(function (r) { if (r.isStar)
                    sumRowStars += r.row.height.value; });
                var vRowMultiplier = (constraint.height - notStarRowsHeight) / sumRowStars;
                this.rowDefs.forEach(function (rowDef) {
                    if (!rowDef.isStar)
                        return;
                    var elements = rowDef.elements;
                    //if should size to content horizontally star rows are treat just like auto rows (same apply to columns of course)
                    if (!vSizeToContent) {
                        var availHeight = vRowMultiplier * rowDef.row.height.value;
                        rowDef.desHeight = availHeight;
                        elements.forEach(function (el) { el.availHeight = availHeight; el.measuredHeightFirstPass = false; });
                    }
                    elementToMeasure.push.apply(elementToMeasure, elements);
                });
                var notStarColumnsHeight = 0;
                this.columnDefs.forEach(function (c) { return notStarColumnsHeight += c.desWidth; });
                var sumColumnStars = 0;
                this.columnDefs.forEach(function (c) { if (c.isStar)
                    sumColumnStars += c.column.width.value; });
                var vColumnMultiplier = (constraint.width - notStarColumnsHeight) / sumColumnStars;
                this.columnDefs.forEach(function (columnDef) {
                    if (!columnDef.isStar)
                        return;
                    var elements = columnDef.elements;
                    if (!hSizeToContent) {
                        var availWidth = vColumnMultiplier * columnDef.column.width.value;
                        columnDef.desWidth = availWidth;
                        elements.forEach(function (el) { el.availWidth = availWidth; el.measuredWidthFirstPass = false; });
                    }
                    elementToMeasure.push.apply(elementToMeasure, elements);
                });
                elementToMeasure.forEach(function (e) {
                    if (!e.measuredHeightFirstPass ||
                        !e.measuredWidthFirstPass) {
                        e.element.measure(new layouts.Size(e.availWidth, e.availHeight));
                        e.desWidth = e.element.desideredSize.width;
                        e.desHeight = e.element.desideredSize.height;
                        e.measuredWidthFirstPass = true;
                        e.measuredHeightFirstPass = true;
                    }
                });
                //finally sum up the desidered size
                this.rowDefs.forEach(function (r) { return desideredSize.height += r.desHeight; });
                this.columnDefs.forEach(function (c) { return desideredSize.width += c.desWidth; });
                return desideredSize;
            };
            Grid.prototype.arrangeOverride = function (finalSize) {
                var _this = this;
                this.elementDefs.forEach(function (el) {
                    var finalLeft = 0;
                    _this.columnDefs.slice(0, el.column).forEach(function (c) { return finalLeft += c.desWidth; });
                    var finalWidth = 0;
                    _this.columnDefs.slice(el.column, el.column + el.columnSpan).forEach(function (c) { return finalWidth += c.desWidth; });
                    finalWidth -= (el.cellLeftOffset * 2);
                    var finalTop = 0;
                    _this.rowDefs.slice(0, el.row).forEach(function (c) { return finalTop += c.desHeight; });
                    var finalHeight = 0;
                    _this.rowDefs.slice(el.row, el.row + el.rowSpan).forEach(function (r) { return finalHeight += r.desHeight; });
                    finalHeight += (el.cellTopOffset * 2);
                    el.element.arrange(new layouts.Rect(finalLeft + el.cellLeftOffset, finalTop + el.cellTopOffset, finalWidth, finalHeight));
                });
                return finalSize;
            };
            Object.defineProperty(Grid.prototype, "rows", {
                get: function () {
                    if (this._rows == null) {
                        this._rows = new layouts.ObservableCollection();
                        this._rows.on(this.onRowsChanged);
                    }
                    return this._rows;
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.onRowsChanged = function (collection, added, removed) {
                _super.prototype.invalidateMeasure.call(this);
            };
            Object.defineProperty(Grid.prototype, "columns", {
                get: function () {
                    if (this._columns == null) {
                        this._columns = new layouts.ObservableCollection();
                        this._columns.on(this.onColumnsChanged);
                    }
                    return this._columns;
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.onColumnsChanged = function (collection, added, removed) {
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
            //Grid.Row property
            Grid.rowProperty = (new Grid()).registerProperty("Grid#Row", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
            //Grid.Column property
            Grid.columnProperty = (new Grid()).registerProperty("Grid#Column", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
            //Grid.RowSpan property
            Grid.rowSpanProperty = (new Grid()).registerProperty("Grid#RowSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
            //Grid.ColumnSpan property
            Grid.columnSpanProperty = (new Grid()).registerProperty("Grid#ColumnSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
            return Grid;
        })(controls.Panel);
        controls.Grid = Grid;
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
            Image.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._imgElement = document.createElement("img");
                var self = this;
                this._imgElement.onload = function (ev) { return self.invalidateMeasure(); };
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Image.prototype.measureOverride = function (constraint) {
                var src = this.Source;
                var mySize = new layouts.Size();
                var imgElement = this._imgElement;
                var srcChanged = (imgElement.src != src);
                if (srcChanged) {
                    imgElement.src = src;
                    imgElement.style.width = isFinite(constraint.width) ? constraint.width.toString() + "px" : "auto";
                    imgElement.style.height = isFinite(constraint.height) ? constraint.height.toString() + "px" : "auto";
                }
                //if image is already loaded than report its size, otherwise the loaded event will invalidate my measure
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    var scaleFactor = Image.computeScaleFactor(constraint, new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight), this.stretch, this.stretchDirection);
                    mySize = new layouts.Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
                }
                if (srcChanged && this.renderSize != null) {
                    imgElement.style.width = this.renderSize.width.toString() + "px";
                    imgElement.style.height = this.renderSize.height.toString() + "px";
                }
                return mySize;
            };
            Image.prototype.arrangeOverride = function (finalSize) {
                var imgElement = this._imgElement;
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    var scaleFactor = Image.computeScaleFactor(finalSize, new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight), this.stretch, this.stretchDirection);
                    return new layouts.Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
                }
                return finalSize;
            };
            /// <summary>
            /// This is a helper function that computes scale factors depending on a target size and a content size
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
            Object.defineProperty(Image.prototype, "Source", {
                get: function () {
                    return _super.prototype.getValue.call(this, Image.srcProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Image.srcProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "stretch", {
                get: function () {
                    return _super.prototype.getValue.call(this, Image.stretchProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Image.stretchProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "stretchDirection", {
                get: function () {
                    return _super.prototype.getValue.call(this, Image.stretchDirectionProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Image.stretchDirectionProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Image.srcProperty = (new Image()).registerProperty("Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Image.stretchProperty = (new Image()).registerProperty("Stretch", Stretch.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Image.stretchDirectionProperty = (new Image()).registerProperty("StretchDirection", StretchDirection.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Image;
        })(layouts.FrameworkElement);
        controls.Image = Image;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ItemsControl = (function (_super) {
            __extends(ItemsControl, _super);
            function ItemsControl() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(ItemsControl.prototype, "Items", {
                get: function () {
                    if (this._items == null) {
                        this._items = new layouts.ObservableCollection();
                        var self = this;
                        this._items.on(function (c, added, removed) {
                            self.invalidateMeasure();
                        });
                    }
                    return this._items.toArray();
                },
                set: function (value) {
                    var self = this;
                    if (this._items != null) {
                        //remove handler so that resource can be disposed
                        this._items.off(this.itemsCollectionChanged);
                    }
                    this._items = new layouts.ObservableCollection(value);
                    this._items.on(this.itemsCollectionChanged);
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.prototype.itemsCollectionChanged = function (collection, added, removed) {
                this.invalidateMeasure();
            };
            Object.defineProperty(ItemsControl.prototype, "ItemsSource", {
                get: function () {
                    return this._itemsSource;
                },
                set: function (value) {
                    if (this._itemsSource == value)
                        return;
                    if (this._itemsSource != null) {
                        this._itemsSource.off(this.itemsSourceCollectionChanged);
                    }
                    this._itemsSource.on(this.itemsSourceCollectionChanged);
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.prototype.itemsSourceCollectionChanged = function (collection, added, removed) {
                this.invalidateMeasure();
            };
            return ItemsControl;
        })(layouts.FrameworkElement);
        controls.ItemsControl = ItemsControl;
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
            Stack.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                var orientation = this.orientation;
                this.Children.forEach(function (child) {
                    if (orientation == Orientation.Horizontal) {
                        child.measure(new layouts.Size(Infinity, constraint.height));
                        mySize.width += child.desideredSize.width;
                        mySize.height = Math.max(mySize.height, child.desideredSize.height);
                    }
                    else {
                        child.measure(new layouts.Size(constraint.width, Infinity));
                        mySize.width = Math.max(mySize.width, child.desideredSize.width);
                        mySize.height += child.desideredSize.height;
                    }
                });
                return mySize;
            };
            Stack.prototype.arrangeOverride = function (finalSize) {
                var orientation = this.orientation;
                var rcChild = new layouts.Rect(0, 0, finalSize.width, finalSize.height);
                var previousChildSize = 0.0;
                this.Children.forEach(function (child) {
                    if (orientation == Orientation.Horizontal) {
                        rcChild.x += previousChildSize;
                        previousChildSize = child.desideredSize.width;
                        rcChild.width = previousChildSize;
                        rcChild.height = Math.max(finalSize.height, child.desideredSize.height);
                    }
                    else {
                        rcChild.y += previousChildSize;
                        previousChildSize = child.desideredSize.height;
                        rcChild.height = previousChildSize;
                        rcChild.width = Math.max(finalSize.width, child.desideredSize.width);
                    }
                    child.arrange(rcChild);
                });
                return finalSize;
            };
            Object.defineProperty(Stack.prototype, "orientation", {
                get: function () {
                    return _super.prototype.getValue.call(this, Stack.orientationProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Stack.orientationProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Stack.orientationProperty = (new Stack()).registerProperty("Orientation", Orientation.Vertical, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure);
            return Stack;
        })(controls.Panel);
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
            TextBlock.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._pElement = document.createElement("p");
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            TextBlock.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                this._pElement.style.whiteSpace = this.whiteSpace;
            };
            TextBlock.prototype.measureOverride = function (constraint) {
                var text = this.text;
                var mySize = new layouts.Size();
                var pElement = this._pElement;
                var txtChanged = (pElement.innerText != text);
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
                mySize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                if (txtChanged && this.renderSize != null) {
                    pElement.style.width = this.renderSize.width.toString() + "px";
                    pElement.style.height = this.renderSize.height.toString() + "px";
                }
                return mySize;
            };
            Object.defineProperty(TextBlock.prototype, "text", {
                get: function () {
                    return _super.prototype.getValue.call(this, TextBlock.textProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, TextBlock.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "whiteSpace", {
                get: function () {
                    return _super.prototype.getValue.call(this, TextBlock.whiteSpaceProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, TextBlock.whiteSpaceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.textProperty = (new TextBlock()).registerProperty("Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBlock.whiteSpaceProperty = (new TextBlock()).registerProperty("WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return TextBlock;
        })(layouts.FrameworkElement);
        controls.TextBlock = TextBlock;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var LmlReader = (function () {
        function LmlReader() {
        }
        LmlReader.Parse = function (lml) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            var loader = new InstanceLoader(window);
            return LmlReader.Load(doc, loader);
        };
        LmlReader.Load = function (lmlNode, loader) {
            var typeName = lmlNode.localName;
            //resolve namespace to module/typename
            if (lmlNode.namespaceURI == null ||
                lmlNode.namespaceURI == LmlReader.DefaultNamespace)
                typeName = "layouts.controls." + typeName;
            //load object
            var containerObject = loader.getInstance(typeName);
            //load properties objects defined by xml attributes
            if (lmlNode.attributes != null) {
                for (var i = 0; i < lmlNode.attributes.length; i++) {
                    var att = lmlNode.attributes[i];
                    //try use FromLml<property-name> if exists
                    //!!!this operation can be expensive!!!
                    if (!LmlReader.TrySetProperty(containerObject, "FromLml" + att.localName, att.value))
                        LmlReader.TrySetProperty(containerObject, att.localName, att.value); //if no property with right name is found go ahead
                }
            }
            var children = Enumerable.From(lmlNode.childNodes).Where(function (_) { return _.nodeType == 1; });
            if (children.Count() == 0)
                return containerObject; //no children
            //load children or content or items
            var objectWithRightProperty = LmlReader.FindObjectWithProperty(containerObject, ["Content", "Child"]);
            if (objectWithRightProperty != null) {
                //support direct content...try to set content of container object with first child
                //skip any other children of lml node
                var contentPropertyName = objectWithRightProperty.hasOwnProperty("Content") ? "Content" : "Child";
                objectWithRightProperty[contentPropertyName] = LmlReader.Load(children.First(), loader);
            }
            else {
                objectWithRightProperty = LmlReader.FindObjectWithProperty(containerObject, ["Children", "Items"]);
                if (objectWithRightProperty != null) {
                    //if object has a property called Children or Items
                    //load all children from children nodes and set property with resulting list
                    var collectionPropertyName = objectWithRightProperty.hasOwnProperty("Children") ? "Children" : "Items";
                    var listOfChildren;
                    for (var childNode in children) {
                        listOfChildren.push(LmlReader.Load(childNode, loader));
                    }
                    objectWithRightProperty[collectionPropertyName] = listOfChildren;
                }
            }
            return containerObject;
        };
        LmlReader.TrySetProperty = function (obj, propertyName, value) {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;
            if (!obj.hasOwnProperty(propertyName))
                return LmlReader.TrySetProperty(obj["__proto__"], propertyName, value);
            obj[propertyName] = value;
            return true;
        };
        LmlReader.FindObjectWithProperty = function (obj, propertyNames) {
            //walk up in class hierarchy to find a property with right name than return the object
            //that has it
            if (obj == null)
                return null;
            for (var i = 0; i < propertyNames.length; i++) {
                if (obj.hasOwnProperty(propertyNames[i]))
                    return obj;
            }
            return LmlReader.FindObjectWithProperty(obj["__proto__"], propertyNames);
        };
        LmlReader.DefaultNamespace = "http://schemas.layouts.com/";
        return LmlReader;
    })();
    layouts.LmlReader = LmlReader;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var ObservableCollection = (function () {
        function ObservableCollection(elements) {
            this.elements = elements;
            this.pcHandlers = [];
            if (elements == null)
                elements = new Array();
        }
        ObservableCollection.prototype.toArray = function () {
            //return underling item list
            return this.elements;
        };
        ObservableCollection.prototype.add = function (element) {
            var _this = this;
            var iElement = this.elements.indexOf(element);
            if (iElement == -1) {
                this.elements.push(element);
                this.pcHandlers.forEach(function (h) {
                    h(_this, [element], []);
                });
            }
        };
        ObservableCollection.prototype.remove = function (element) {
            var _this = this;
            var iElement = this.elements.indexOf(element);
            if (iElement != -1) {
                this.elements.splice(iElement, 1);
                this.pcHandlers.forEach(function (h) {
                    h(_this, [], [element]);
                });
            }
        };
        ObservableCollection.prototype.at = function (index) {
            return this.elements[index];
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
        ObservableCollection.prototype.on = function (handler) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        };
        //unsubscribe from collection changes
        ObservableCollection.prototype.off = function (handler) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        };
        return ObservableCollection;
    })();
    layouts.ObservableCollection = ObservableCollection;
})(layouts || (layouts = {}));
var layouts;
(function (layouts) {
    var PropertyPath = (function () {
        function PropertyPath(path, source) {
            this.pcHandlers = [];
            this.path = path;
            this.source = source;
            this.build();
            this.attachShource();
        }
        PropertyPath.prototype.attachShource = function () {
            this.source.subscribePropertyChanges(this.onPropertyChanged);
        };
        PropertyPath.prototype.detachSource = function () {
            this.source.unsubscribePropertyChanges(this.onPropertyChanged);
        };
        PropertyPath.prototype.build = function () {
            var oldNext = this.next;
            if (this.next != null) {
                this.next.detachSource();
                this.next.prev = null;
            }
            if (this.path == "" ||
                this.path == ".") {
                this.name = ".";
                this.next = null;
            }
            else {
                var dotIndex = this.path.indexOf(".");
                if (dotIndex > -1) {
                    this.name = this.path.substring(0, dotIndex);
                    this.sourceProperty = layouts.DepObject.getProperty(this.source.typeName, this.name);
                    var sourcePropertyValue = this.source.getValue(this.sourceProperty);
                    if (sourcePropertyValue != null) {
                        var nextPath = this.path.substring(dotIndex + 1);
                        if (this.next != null &&
                            (this.next.path != nextPath || this.next.source != sourcePropertyValue))
                            this.next = new PropertyPath(this.path.substring(dotIndex + 1), sourcePropertyValue);
                        else
                            this.next.build();
                    }
                    else
                        this.next = null;
                }
                else {
                    this.name = this.path;
                    this.next = null;
                }
            }
            if (this.next != null) {
                this.next.attachShource();
                this.next.prev = this;
            }
            if (oldNext != this.next) {
                this.onPathChanged();
            }
        };
        PropertyPath.prototype.onPathChanged = function () {
            var _this = this;
            if (this.prev != null)
                this.prev.onPathChanged();
            else {
                this.pcHandlers.forEach(function (h) {
                    h(_this);
                });
            }
        };
        //subscribe to path change event
        PropertyPath.prototype.subscribePathChanges = function (handler) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        };
        //unsubscribe from path change event
        PropertyPath.prototype.unsubscribePathChanges = function (handler) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        };
        PropertyPath.prototype.getValue = function () {
            if (this.next != null)
                return this.next.getValue();
            else if (this.name == ".")
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: null };
            else if (this.name != null)
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: this.sourceProperty };
            else
                return { success: false };
        };
        PropertyPath.prototype.setValue = function (value) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null)
                this.source.setValue(this.sourceProperty, value);
        };
        PropertyPath.prototype.onPropertyChanged = function (depObject, property, value) {
            if (depObject == this.source &&
                property.name == this.name) {
                this.build();
            }
        };
        return PropertyPath;
    })();
    layouts.PropertyPath = PropertyPath;
})(layouts || (layouts = {}));
//# sourceMappingURL=layouts.js.map