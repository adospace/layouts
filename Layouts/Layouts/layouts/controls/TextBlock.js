/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
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
            TextBlock.typeName = "layouts.controls.TextBlock";
            TextBlock.textProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
            TextBlock.whiteSpaceProperty = layouts.DepObject.registerProperty(TextBlock.typeName, "WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return TextBlock;
        })(layouts.FrameworkElement);
        controls.TextBlock = TextBlock;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
