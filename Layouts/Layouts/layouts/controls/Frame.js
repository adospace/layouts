var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Frame = (function (_super) {
            __extends(Frame, _super);
            function Frame() {
                return _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Frame.prototype, "typeName", {
                get: function () {
                    return Frame.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Frame.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._frameElement = document.createElement("frame");
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Frame.prototype.measureOverride = function (constraint) {
                var src = this.Source;
                var mySize = new layouts.Size();
                var pElement = this._frameElement;
                var srcChanged = (pElement.src != src);
                if (isFinite(constraint.width))
                    pElement.style.maxWidth = constraint.width + "px";
                if (isFinite(constraint.height))
                    pElement.style.maxHeight = constraint.height + "px";
                pElement.style.width = "auto";
                pElement.style.height = "auto";
                if (srcChanged) {
                    pElement.src = src;
                }
                mySize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                if (srcChanged && this.renderSize != null) {
                    pElement.style.width = this.renderSize.width.toString() + "px";
                    pElement.style.height = this.renderSize.height.toString() + "px";
                }
                return mySize;
            };
            Object.defineProperty(Frame.prototype, "Source", {
                get: function () {
                    return this.getValue(Frame.sourceProperty);
                },
                set: function (value) {
                    this.setValue(Frame.sourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Frame;
        }(layouts.FrameworkElement));
        Frame.typeName = "layouts.controls.Frame";
        Frame.sourceProperty = layouts.DepObject.registerProperty(Frame.typeName, "Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.Frame = Frame;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
