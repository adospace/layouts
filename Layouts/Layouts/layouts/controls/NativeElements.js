var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
                this._visual.innerHTML = this._innerXaml;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            div.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            div.prototype.measureOverride = function (constraint) {
                var pElement = this._visual;
                ;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            div.prototype.arrangeOverride = function (finalSize) {
                var pElement = this._visual;
                pElement.style.width = finalSize.width.toString() + "px";
                pElement.style.height = finalSize.height.toString() + "px";
                return finalSize;
            };
            div.typeName = "layouts.controls.div";
            return div;
        }(layouts.FrameworkElement));
        controls.div = div;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
