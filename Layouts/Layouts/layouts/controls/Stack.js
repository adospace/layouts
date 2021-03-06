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
