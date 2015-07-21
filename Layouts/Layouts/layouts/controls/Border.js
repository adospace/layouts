/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tsui;
(function (tsui) {
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
            Object.defineProperty(Border.prototype, "child", {
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
                var mySize = new tsui.Size();
                // Compute the chrome size added by the various elements
                var border = new tsui.Size(this.borderThickness.left + this.borderThickness.right, this.borderThickness.top + this.borderThickness.bottom);
                var padding = new tsui.Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
                //If we have a child
                if (this._child != null) {
                    // Combine into total decorating size
                    var combined = new tsui.Size(border.width + padding.width, border.height + padding.height);
                    // Remove size of border only from child's reference size.
                    var childConstraint = new tsui.Size(Math.max(0.0, constraint.width - combined.width), Math.max(0.0, constraint.height - combined.height));
                    this._child.measure(childConstraint);
                    var childSize = this._child.desideredSize;
                    // Now use the returned size to drive our size, by adding back the margins, etc.
                    mySize.width = childSize.width + combined.width;
                    mySize.height = childSize.height + combined.height;
                }
                else {
                    // Combine into total decorating size
                    mySize = new tsui.Size(border.width + padding.width, border.height + padding.height);
                }
                return mySize;
            };
            Border.prototype.arrangeOverride = function (finalSize) {
                var borders = this.borderThickness;
                var boundRect = new tsui.Rect(0, 0, finalSize.width, finalSize.height);
                var innerRect = new tsui.Rect(boundRect.x + borders.left, boundRect.y + borders.top, Math.max(0.0, boundRect.width - borders.left - borders.right), Math.max(0.0, boundRect.height - borders.top - borders.bottom));
                var borderBrush = this.borderBrush;
                //  arrange child
                var child = this._child;
                var padding = this.padding;
                if (child != null) {
                    var childRect = new tsui.Rect(innerRect.x + padding.left, innerRect.y + padding.top, Math.max(0.0, innerRect.width - padding.left - padding.right), Math.max(0.0, innerRect.height - padding.top - padding.bottom));
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
            Border.borderThicknessProperty = (new Border()).registerProperty("BorderThickness", new tsui.Thickness(), 1 /* AffectsMeasure */ | 16 /* AffectsRender */);
            Border.paddingProperty = (new Border()).registerProperty("Padding", new tsui.Thickness(), 1 /* AffectsMeasure */ | 16 /* AffectsRender */);
            Border.backgroundProperty = (new Border()).registerProperty("Background", null, 16 /* AffectsRender */);
            Border.borderBrushProperty = (new Border()).registerProperty("BorderBrush", null, 16 /* AffectsRender */);
            return Border;
        })(tsui.FrameworkElement);
        controls.Border = Border;
    })(controls = tsui.controls || (tsui.controls = {}));
})(tsui || (tsui = {}));
//# sourceMappingURL=Border.js.map