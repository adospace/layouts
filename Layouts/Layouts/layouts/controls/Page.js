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
        var Page = (function (_super) {
            __extends(Page, _super);
            function Page() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Page.prototype, "typeName", {
                get: function () {
                    return Page.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "child", {
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
            Page.prototype.layoutOverride = function () {
                if (this._child != null)
                    this._child.layout();
            };
            Page.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                if (this._child != null) {
                    this._child.measure(constraint);
                    return this._child.desideredSize;
                }
                return mySize;
            };
            Page.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                if (child != null) {
                    child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                }
                return finalSize;
            };
            Object.defineProperty(Page.prototype, "sizeToContent", {
                get: function () {
                    return this.getValue(Page.sizeToContentProperty);
                },
                set: function (value) {
                    this.setValue(Page.sizeToContentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Page.typeName = "layouts.controls.Page";
            Page.sizeToContentProperty = layouts.DepObject.registerProperty(Page.typeName, "SizeToContent", layouts.SizeToContent.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Page;
        })(layouts.FrameworkElement);
        controls.Page = Page;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
