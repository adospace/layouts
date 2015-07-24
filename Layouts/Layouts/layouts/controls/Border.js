/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
            Border.typeName = "layouts.controls.Border";
            Border.borderThicknessProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderThickness", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.paddingProperty = layouts.DepObject.registerProperty(Border.typeName, "Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.backgroundProperty = layouts.DepObject.registerProperty(Border.typeName, "Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Border.borderBrushProperty = layouts.DepObject.registerProperty(Border.typeName, "BorderBrush", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Border;
        })(layouts.FrameworkElement);
        controls.Border = Border;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
//# sourceMappingURL=Border.js.map