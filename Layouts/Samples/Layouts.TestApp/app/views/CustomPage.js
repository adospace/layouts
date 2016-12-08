var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var views;
    (function (views) {
        var CustomPage = (function (_super) {
            __extends(CustomPage, _super);
            function CustomPage() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(CustomPage.prototype, "typeName", {
                get: function () {
                    return CustomPage.typeName;
                },
                enumerable: true,
                configurable: true
            });
            CustomPage.typeName = "app.views.CustomPage";
            return CustomPage;
        }(layouts.controls.Page));
        views.CustomPage = CustomPage;
    })(views = app.views || (app.views = {}));
})(app || (app = {}));
