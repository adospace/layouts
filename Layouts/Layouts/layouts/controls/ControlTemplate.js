var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
