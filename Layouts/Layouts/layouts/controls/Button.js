/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
/// <reference path="..\Command.ts" /> 
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
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Button.prototype, "typeName", {
                get: function () {
                    return Button.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "child", {
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
                            if (this._buttonElement != null)
                                this._child.attachVisual(this._buttonElement);
                        }
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Button.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._buttonElement = document.createElement("button");
                if (this._child != null) {
                    this._child.attachVisual(this._buttonElement);
                }
                this._buttonElement.onclick = function (ev) { return _this.onClick(ev); };
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Button.prototype.measureOverride = function (constraint) {
                this._buttonElement.disabled = this.command == null || !this.command.canExecute(this.commandParameter);
                var mySize = new layouts.Size();
                var padding = new layouts.Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);
                if (this._child != null) {
                    var childConstraint = new layouts.Size(Math.max(0.0, constraint.width - padding.width), Math.max(0.0, constraint.height - padding.height));
                    this._child.measure(childConstraint);
                    var childSize = this._child.desideredSize;
                    mySize.width = childSize.width + padding.width;
                    mySize.height = childSize.height + padding.height;
                }
                else if (this.text != null) {
                    var text = this.text;
                    var mySize = new layouts.Size();
                    var pElement = this._buttonElement;
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
                    mySize = new layouts.Size(pElement.offsetWidth, pElement.offsetHeight);
                    if (this.renderSize != null) {
                        pElement.style.width = this.renderSize.width.toString() + "px";
                        pElement.style.height = this.renderSize.height.toString() + "px";
                    }
                    return mySize;
                }
                else {
                    mySize = new layouts.Size(padding.width, padding.height);
                }
                return mySize;
            };
            Button.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                var padding = this.padding;
                if (child != null) {
                    var childRect = new layouts.Rect(padding.left, padding.top, Math.max(0.0, finalSize.width - padding.left - padding.right), Math.max(0.0, finalSize.height - padding.top - padding.bottom));
                    child.arrange(childRect);
                }
                return finalSize;
            };
            Button.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                if (this._child != null)
                    this._child.layout();
            };
            Button.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Button.commandProperty) {
                    if (oldValue != null)
                        oldValue.offCanExecuteChangeNotify(this);
                    if (value != null)
                        value.onCanExecuteChangeNotify(this);
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Button.prototype.onCommandCanExecuteChanged = function (command) {
                if (this._buttonElement != null)
                    this._buttonElement.disabled = this.command == null || !this.command.canExecute(this.commandParameter);
            };
            Object.defineProperty(Button.prototype, "padding", {
                get: function () {
                    return this.getValue(Button.paddingProperty);
                },
                set: function (value) {
                    this.setValue(Button.paddingProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "text", {
                get: function () {
                    return this.getValue(Button.textProperty);
                },
                set: function (value) {
                    this.setValue(Button.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "command", {
                get: function () {
                    return this.getValue(Button.commandProperty);
                },
                set: function (value) {
                    this.setValue(Button.commandProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "commandParameter", {
                get: function () {
                    return this.getValue(Button.commandParameterProperty);
                },
                set: function (value) {
                    this.setValue(Button.commandParameterProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "whiteSpace", {
                get: function () {
                    return this.getValue(Button.whiteSpaceProperty);
                },
                set: function (value) {
                    this.setValue(Button.whiteSpaceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Button.typeName = "layouts.controls.Button";
            Button.paddingProperty = layouts.DepObject.registerProperty(Button.typeName, "Padding", new layouts.Thickness(), layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.textProperty = layouts.DepObject.registerProperty(Button.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.commandProperty = layouts.DepObject.registerProperty(Button.typeName, "Command", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.commandParameterProperty = layouts.DepObject.registerProperty(Button.typeName, "commandParameter", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Button.whiteSpaceProperty = layouts.DepObject.registerProperty(Button.typeName, "WhiteSpace", "pre", layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Button;
        })(layouts.FrameworkElement);
        controls.Button = Button;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
