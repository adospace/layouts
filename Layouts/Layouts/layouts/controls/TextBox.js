var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
                this._pElement.value = this.text;
                this._pElement.type = this.type;
                this._pElement.readOnly = this.isReadonly;
                this._pElement.placeholder = this.placeholder;
                this._pElement.oninput = function (ev) { return _this.onTextChanged(); };
                this._pElement.onchange = function (ev) { return _this.onTextChanged(); };
                this._pElement.onkeypress = function (ev) { return _this.onTextChanged(); };
                this._pElement.onpaste = function (ev) { return _this.onTextChanged(); };
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            TextBox.prototype.onTextChanged = function () {
                this.text = this._pElement.value;
            };
            TextBox.prototype.measureOverride = function (constraint) {
                var pElement = this._pElement;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.offsetWidth, pElement.offsetHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            TextBox.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                if (this.renderSize != null) {
                    this._pElement.style.width = (this.renderSize.width - (this._pElement.offsetWidth - this.renderSize.width)) + "px";
                    this._pElement.style.height = (this.renderSize.height - (this._pElement.offsetHeight - this.renderSize.height)) + "px";
                }
            };
            TextBox.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == TextBox.textProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        this._pElement.value = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == TextBox.placeholderProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.placeholder = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == TextBox.typeProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.type = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == TextBox.isReadonlyProperty) {
                    var pElement = this._pElement;
                    if (pElement != null) {
                        pElement.readOnly = value;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
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
            Object.defineProperty(TextBox.prototype, "type", {
                get: function () {
                    return this.getValue(TextBox.typeProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.typeProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBox.prototype, "isReadonly", {
                get: function () {
                    return this.getValue(TextBox.isReadonlyProperty);
                },
                set: function (value) {
                    this.setValue(TextBox.isReadonlyProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            TextBox.typeName = "layouts.controls.TextBox";
            TextBox.textProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBox.placeholderProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Placeholder", "", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBox.typeProperty = layouts.DepObject.registerProperty(TextBox.typeName, "Type", "text", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            TextBox.isReadonlyProperty = layouts.DepObject.registerProperty(TextBox.typeName, "IsReadonly", false);
            return TextBox;
        }(layouts.FrameworkElement));
        controls.TextBox = TextBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
