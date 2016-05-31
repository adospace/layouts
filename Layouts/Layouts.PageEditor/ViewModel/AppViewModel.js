var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppViewModel = (function (_super) {
    __extends(AppViewModel, _super);
    function AppViewModel() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AppViewModel.prototype, "typeName", {
        get: function () {
            return AppViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    AppViewModel.typeName = "appViewModel";
    return AppViewModel;
})(layouts.DepObject);
//# sourceMappingURL=AppViewModel.js.map