var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        return FrameworkElement;
    }(layouts.UIElement));
    layouts.FrameworkElement = FrameworkElement;
})(layouts || (layouts = {}));
