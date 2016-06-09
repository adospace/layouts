var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TestViewModel = (function (_super) {
    __extends(TestViewModel, _super);
    function TestViewModel() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TestViewModel.prototype, "typeName", {
        get: function () {
            return TestViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestViewModel.prototype, "title", {
        get: function () {
            return "TestTitle";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestViewModel.prototype, "myCommand", {
        get: function () {
            var _this = this;
            if (this._myCommand == null)
                this._myCommand = new layouts.Command(function (cmd, p) { return _this.onMyCommand(); }, function (cmd, p) { return true; });
            return this._myCommand;
        },
        enumerable: true,
        configurable: true
    });
    TestViewModel.prototype.onMyCommand = function () {
    };
    TestViewModel.typeName = "TestViewModel";
    return TestViewModel;
}(layouts.DepObject));
