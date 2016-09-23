var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var CheckBox = (function (_super) {
            __extends(CheckBox, _super);
            function CheckBox() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(CheckBox.prototype, "typeName", {
                get: function () {
                    return CheckBox.typeName;
                },
                enumerable: true,
                configurable: true
            });
            CheckBox.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._pElementInput = document.createElement("input");
                this._pElementInput.type = this.type;
                this._pElementInput.checked = this.isChecked;
                this._pElementInput.onclick = function (ev) { return _this.onCheckChanged(); };
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            CheckBox.prototype.onCheckChanged = function () {
                this.isChecked = this._pElementInput.checked;
            };
            CheckBox.prototype.measureOverride = function (constraint) {
                var pElement = this._pElementInput;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.offsetWidth, pElement.offsetHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            CheckBox.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == CheckBox.nameProperty) {
                    var pElement = this._pElementInput;
                    if (pElement != null) {
                        this._pElementInput.name = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == CheckBox.typeProperty) {
                    var pElement = this._pElementInput;
                    if (pElement != null) {
                        this._pElementInput.type = value;
                        this._measuredSize = null;
                    }
                }
                else if (property == CheckBox.isCheckedProperty) {
                    var pElement = this._pElementInput;
                    if (pElement != null) {
                        this._pElementInput.checked = value;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(CheckBox.prototype, "isChecked", {
                get: function () {
                    return this.getValue(CheckBox.isCheckedProperty);
                },
                set: function (value) {
                    this.setValue(CheckBox.isCheckedProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "name", {
                get: function () {
                    return this.getValue(CheckBox.nameProperty);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "placeholder", {
                set: function (value) {
                    this.setValue(CheckBox.nameProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "type", {
                get: function () {
                    return this.getValue(CheckBox.typeProperty);
                },
                set: function (value) {
                    this.setValue(CheckBox.typeProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            CheckBox.typeName = "layouts.controls.CheckBox";
            CheckBox.isCheckedProperty = layouts.DepObject.registerProperty(CheckBox.typeName, "IsChecked", false, layouts.FrameworkPropertyMetadataOptions.None);
            CheckBox.nameProperty = layouts.DepObject.registerProperty(CheckBox.typeName, "Name", "", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            CheckBox.typeProperty = layouts.DepObject.registerProperty(CheckBox.typeName, "Type", "checkbox", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return CheckBox;
        }(layouts.FrameworkElement));
        controls.CheckBox = CheckBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
