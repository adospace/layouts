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
        var DataTemplate = (function (_super) {
            __extends(DataTemplate, _super);
            function DataTemplate() {
                _super.apply(this, arguments);
                this.targetType = null;
            }
            Object.defineProperty(DataTemplate.prototype, "typeName", {
                get: function () {
                    return DataTemplate.typeName;
                },
                enumerable: true,
                configurable: true
            });
            DataTemplate.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            DataTemplate.prototype.setXamlLoader = function (loader) {
                this._xamlLoader = loader;
            };
            DataTemplate.prototype.createElement = function () {
                return this._xamlLoader.Parse(this._innerXaml);
            };
            DataTemplate.typeName = "layouts.controls.DataTemplate";
            return DataTemplate;
        })(layouts.DepObject);
        controls.DataTemplate = DataTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
