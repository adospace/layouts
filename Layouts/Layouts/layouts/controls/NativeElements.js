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
        var div = (function (_super) {
            __extends(div, _super);
            function div() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(div.prototype, "typeName", {
                get: function () {
                    return div.typeName;
                },
                enumerable: true,
                configurable: true
            });
            div.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = document.createElement("div");
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            div.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            div.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                var pElement = this._visual;
                if (isFinite(constraint.width))
                    pElement.style.maxWidth = constraint.width + "px";
                if (isFinite(constraint.height))
                    pElement.style.maxHeight = constraint.height + "px";
                pElement.style.width = "auto";
                pElement.style.height = "auto";
                pElement.innerHTML = this._innerXaml;
                mySize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                if (this.renderSize != null) {
                    pElement.style.width = this.renderSize.width.toString() + "px";
                    pElement.style.height = this.renderSize.height.toString() + "px";
                }
                return mySize;
            };
            div.typeName = "layouts.controls.div";
            return div;
        })(layouts.FrameworkElement);
        controls.div = div;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
