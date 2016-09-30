var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Label = (function (_super) {
            __extends(Label, _super);
            function Label() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Label.prototype, "typeName", {
                get: function () {
                    return Label.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Label.prototype.createElement = function (elementContainer) {
                var label = document.createElement("label");
                label.htmlFor = this.htmlFor;
                return label;
            };
            Object.defineProperty(Label.prototype, "htmlFor", {
                get: function () {
                    return this.getValue(Label.htmlForProperty);
                },
                set: function (value) {
                    this.setValue(Label.htmlForProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Label.typeName = "layouts.controls.Label";
            Label.htmlForProperty = layouts.DepObject.registerProperty(Label.typeName, "For", null, layouts.FrameworkPropertyMetadataOptions.None, function (v) { return String(v); });
            return Label;
        }(controls.TextBlock));
        controls.Label = Label;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));