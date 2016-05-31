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
        var UserControl = (function (_super) {
            __extends(UserControl, _super);
            function UserControl() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(UserControl.prototype, "typeName", {
                get: function () {
                    return UserControl.typeName;
                },
                enumerable: true,
                configurable: true
            });
            UserControl.prototype.initializeComponent = function () {
                return null;
            };
            UserControl.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                var child = this._content;
                if (child == null) {
                    this._content = child = this.initializeComponent();
                    if (child != null)
                        child.parent = this;
                }
                if (child != null) {
                    child.attachVisual(this._container);
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            UserControl.prototype.measureOverride = function (constraint) {
                var child = this._content;
                if (child != null) {
                    child.measure(constraint);
                    return child.desideredSize;
                }
                return new layouts.Size();
            };
            UserControl.prototype.arrangeOverride = function (finalSize) {
                var child = this._content;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            UserControl.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._content;
                if (child != null)
                    child.layout(this.visualOffset);
            };
            UserControl.typeName = "layouts.controls.UserControl";
            return UserControl;
        })(layouts.FrameworkElement);
        controls.UserControl = UserControl;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
