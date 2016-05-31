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
        var TextBox = (function (_super) {
            __extends(TextBox, _super);
            function TextBox() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(TextBox.prototype, "typeName", {
                get: function () {
                    return TextBox.typeName;
                },
                enumerable: true,
                configurable: true
            });
            TextBox.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._pElement = document.createElement("input");
                this._pElement.type = "text";
                this._pElement.oninput = function (ev) { return _this.onTextChanged(); };
                this._pElement.onchange = function (ev) { return _this.onTextChanged(); };
                this._pElement.onkeypress = function (ev) { return _this.onTextChanged(); };
                this._pElement.onpaste = function (ev) { return _this.onTextChanged(); };
                this._pElement.placeholder = this.placeholder;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            TextBox.prototype.onTextChanged = function () {
                this.text = this._pElement.value;
            };
            TextBox.prototype.measureOverride = function (constraint) {
                var text = this.text;
                var mySize = new layouts.Size();
                var pElement = this._pElement;
                var txtChanged = (pElement.value != text);
                if (isFinite(constraint.width))
                    pElement.style.maxWidth = constraint.width + "px";
                if (isFinite(constraint.height))
                    pElement.style.maxHeight = constraint.height + "px";
                pElement.style.width = "auto";
                pElement.style.height = "auto";
                if (txtChanged) {
                    pElement.value = this.text;
                }
                this.clientSizeOffset = new layouts.Size(pElement.offsetWidth - pElement.clientWidth, pElement.offsetHeight - pElement.clientHeight);
                mySize = new layouts.Size(pElement.offsetWidth, pElement.offsetHeight);
                return mySize;
            };
            TextBox.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                this._pElement.style.width = (this.renderSize.width - this.clientSizeOffset.width) + "px";
                this._pElement.style.height = (this.renderSize.height - this.clientSizeOffset.height) + "px";
            };
            Object.defineProperty(TextBox.prototype, "text", {
                get: function () {
                    return this.getValue(TextBox.textProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBox.prototype, "placeholder", {
                get: function () {
                    return this.getValue(TextBox.placeholderProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.placeholderProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            TextBox.typeName = "layouts.controls.TextBox";
            TextBox.textProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBox.placeholderProperty = layouts.DepObject.registerProperty(TextBox.placeholderProperty, "Placeholder", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return TextBox;
        })(layouts.FrameworkElement);
        controls.TextBox = TextBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
