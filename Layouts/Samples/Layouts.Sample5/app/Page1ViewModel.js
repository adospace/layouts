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
    var Page1ViewModel = (function (_super) {
        __extends(Page1ViewModel, _super);
        function Page1ViewModel(view, username) {
            var _this = _super.call(this) || this;
            _this.view = view;
            _this._username = username;
            return _this;
        }
        Object.defineProperty(Page1ViewModel.prototype, "typeName", {
            get: function () {
                return Page1ViewModel.typeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Page1ViewModel.prototype, "username", {
            get: function () {
                return this._username;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Page1ViewModel.prototype, "parameter", {
            get: function () {
                return this._parameter;
            },
            set: function (value) {
                if (this._parameter != value) {
                    var oldValue = this._parameter;
                    this._parameter = value;
                    this.onPropertyChanged("parameter", value, oldValue);
                    this._gotoPage2Command.canExecuteChanged();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Page1ViewModel.prototype, "gotoPage2Command", {
            get: function () {
                var _this = this;
                if (this._gotoPage2Command == null)
                    this._gotoPage2Command = new layouts.Command(function (cmd, p) { return _this.onGotoPage2(); }, function (cmd, p) { return _this.parameter != null && _this.parameter.trim().length > 0; });
                return this._gotoPage2Command;
            },
            enumerable: true,
            configurable: true
        });
        Page1ViewModel.prototype.onGotoPage2 = function () {
            layouts.Application.current.navigate("/Page2/" + this.parameter);
        };
        return Page1ViewModel;
    }(layouts.DepObject));
    Page1ViewModel.typeName = "app.Page1ViewModel";
    app.Page1ViewModel = Page1ViewModel;
})(app || (app = {}));
