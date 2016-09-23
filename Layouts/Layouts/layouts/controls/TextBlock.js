var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var TextBlock = (function (_super) {
            __extends(TextBlock, _super);
            function TextBlock() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(TextBlock.prototype, "typeName", {
                get: function () {
                    return TextBlock.typeName;
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.prototype.createElement = function (elementContainer) {
                return document.createElement("p");
            };
            TextBlock.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._pElement = this.createElement(elementContainer);
                this._visual.style.msUserSelect =
                    this._visual.style.webkitUserSelect = "none";
                this._pElement.style.whiteSpace = this.whiteSpace;
                var text = this.text;
                var format = this.format;
                text = format != null && text != null && text != layouts.Consts.stringEmpty ? format.format(text) : text;
                this._pElement.innerHTML = text == null ? layouts.Consts.stringEmpty : text;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            TextBlock.prototype.measureOverride = function (constraint) {
                var pElement = this._pElement;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            TextBlock.prototype.arrangeOverride = function (finalSize) {
                var pElement = this._pElement;
                pElement.style.width = finalSize.width.toString() + "px";
                pElement.style.height = finalSize.height.toString() + "px";
                return finalSize;
            };
            TextBlock.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == TextBlock.textProperty ||
                    property == TextBlock.formatProperty) {
                    var pElement = this._pElement;
                    var text = value;
                    var format = this.format;
                    text = format != null && text != null && text != layouts.Consts.stringEmpty ? format.format(text) : text;
                    if (pElement != null) {
                        pElement.innerHTML = text == null ? layouts.Consts.stringEmpty : text;
                        this._measuredSize = null;
                    }
                }
                else if (property == TextBlock.whiteSpaceProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.style.whiteSpace = value;
                        this._measuredSize = null;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(TextBlock.prototype, "text", {
                get: function () {
                    return this.getValue(TextBlock.textProperty);
                },
                set: function (value) {
                    this.setValue(TextBlock.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "whiteSpace", {
                get: function () {
                    return this.getValue(TextBlock.whiteSpaceProperty);
                },
                set: function (value) {
                    this.setValue(TextBlock.whiteSpaceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "format", {
                get: function () {
                    return this.getValue(TextBlock.formatProperty);
                },
                set: function (value) {
                    this.setValue(TextBlock.formatProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.typeName = "layouts.controls.TextBlock";
            TextBlock.textProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
            TextBlock.whiteSpaceProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBlock.formatProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "Format", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
            return TextBlock;
        }(layouts.FrameworkElement));
        controls.TextBlock = TextBlock;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
