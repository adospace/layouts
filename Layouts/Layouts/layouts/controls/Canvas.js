var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            Canvas.leftProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Left", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            Canvas.topProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Top", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            Canvas.rightProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Right", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            Canvas.bottomProperty = layouts.DepObject.registerProperty(Canvas.typeName, "Canvas#Bottom", NaN, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return parseFloat(v); });
            return Canvas;
        }(controls.Panel));
        controls.Canvas = Canvas;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
