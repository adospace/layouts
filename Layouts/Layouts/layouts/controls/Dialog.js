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
        var Dialog = (function (_super) {
            __extends(Dialog, _super);
            function Dialog() {
                _super.call(this);
                this.child = this.initializeComponent();
            }
            Object.defineProperty(Dialog.prototype, "typeName", {
                get: function () {
                    return Dialog.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Dialog.initProperties = function () {
                layouts.FrameworkElement.horizontalAlignmentProperty.overrideDefaultValue(Dialog.typeName, "Center");
                layouts.FrameworkElement.verticalAlignmentProperty.overrideDefaultValue(Dialog.typeName, "Center");
            };
            Object.defineProperty(Dialog.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    if (this._child != value) {
                        if (this._child != null && this._child.parent == this) {
                            this._child.attachVisual(null);
                            this._child.parent = null;
                        }
                        this._child = value;
                        if (this._child != null) {
                            this._child.parent = this;
                            this._child.attachVisual(document.body);
                        }
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Dialog.prototype.initializeComponent = function () {
                return null;
            };
            Dialog.prototype.layoutOverride = function () {
                if (this._child != null)
                    this._child.layout();
            };
            Dialog.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                if (this._child != null) {
                    this._child.measure(constraint);
                    return this._child.desideredSize;
                }
                return mySize;
            };
            Dialog.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                if (child != null) {
                    child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                }
                return finalSize;
            };
            Object.defineProperty(Dialog.prototype, "sizeToContent", {
                get: function () {
                    return this.getValue(Dialog.sizeToContentProperty);
                },
                set: function (value) {
                    this.setValue(Dialog.sizeToContentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Dialog.typeName = "layouts.controls.Dialog";
            Dialog._init = Dialog.initProperties();
            Dialog.sizeToContentProperty = layouts.DepObject.registerProperty(Dialog.typeName, "SizeToContent", layouts.SizeToContent.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Dialog;
        })(layouts.FrameworkElement);
        controls.Dialog = Dialog;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
