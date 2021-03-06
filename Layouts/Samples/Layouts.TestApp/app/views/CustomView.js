var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var app;
(function (app) {
    var views;
    (function (views) {
        var CustomView = (function (_super) {
            __extends(CustomView, _super);
            function CustomView() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(CustomView.prototype, "typeName", {
                get: function () {
                    return CustomView.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return CustomView;
        }(layouts.controls.UserControl));
        CustomView.typeName = "app.views.CustomView";
        views.CustomView = CustomView;
    })(views = app.views || (app.views = {}));
})(app || (app = {}));
