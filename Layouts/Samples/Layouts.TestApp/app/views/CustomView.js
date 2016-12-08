var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var views;
    (function (views) {
        var CustomView = (function (_super) {
            __extends(CustomView, _super);
            function CustomView() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(CustomView.prototype, "typeName", {
                get: function () {
                    return CustomView.typeName;
                },
                enumerable: true,
                configurable: true
            });
            CustomView.typeName = "app.views.CustomView";
            return CustomView;
        }(layouts.controls.UserControl));
        views.CustomView = CustomView;
    })(views = app.views || (app.views = {}));
})(app || (app = {}));
