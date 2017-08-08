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
var TestViewModel = (function (_super) {
    __extends(TestViewModel, _super);
    function TestViewModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._cmdEnabled = true;
        return _this;
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
                this._myCommand = new layouts.Command(function (cmd, p) { return _this.onMyCommand(); }, function (cmd, p) { return _this.cmdEnabled; });
            return this._myCommand;
        },
        enumerable: true,
        configurable: true
    });
    TestViewModel.prototype.onMyCommand = function () {
        alert("OnMyCommand!");
    };
    Object.defineProperty(TestViewModel.prototype, "cmdEnabled", {
        get: function () {
            return this._cmdEnabled;
        },
        set: function (value) {
            if (this._cmdEnabled != value) {
                var oldValue = this._cmdEnabled;
                this._cmdEnabled = value;
                this.onPropertyChanged("cmdEnabled", value, oldValue);
                this.myCommand.canExecuteChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    return TestViewModel;
}(layouts.DepObject));
TestViewModel.typeName = "TestViewModel";
