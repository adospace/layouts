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
    var LoginViewModel = (function (_super) {
        __extends(LoginViewModel, _super);
        function LoginViewModel(view) {
            var _this = _super.call(this) || this;
            _this.view = view;
            return _this;
        }
        Object.defineProperty(LoginViewModel.prototype, "typeName", {
            get: function () {
                return LoginViewModel.typeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginViewModel.prototype, "username", {
            get: function () {
                return this._username;
            },
            set: function (value) {
                var _this = this;
                if (this._username != value) {
                    var oldValue = this._username;
                    this._username = value;
                    this.onPropertyChanged("username", value, oldValue);
                    layouts.Application.beginInvoke(function () {
                        return _this._loginCommand.canExecuteChanged();
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginViewModel.prototype, "password", {
            get: function () {
                return this._password;
            },
            set: function (value) {
                if (this._password != value) {
                    var oldValue = this._password;
                    this._password = value;
                    this.onPropertyChanged("password", value, oldValue);
                    this._loginCommand.canExecuteChanged();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginViewModel.prototype, "loginCommand", {
            get: function () {
                var _this = this;
                if (this._loginCommand == null)
                    this._loginCommand = new layouts.Command(function (cmd, p) { return _this.onLogin(); }, function (cmd, p) { return _this.canLogin(); });
                return this._loginCommand;
            },
            enumerable: true,
            configurable: true
        });
        LoginViewModel.prototype.onLogin = function () {
            if (this._username == "test" &&
                this._password == "test") {
                userLogged = true;
                layouts.Application.current.navigate("/page1/" + this._username);
            }
            else
                alert("Unable to login!");
        };
        LoginViewModel.prototype.canLogin = function () {
            return this._username != null && this._username.trim().length > 0 &&
                this._password != null && this._password.trim().length > 0;
        };
        return LoginViewModel;
    }(layouts.DepObject));
    LoginViewModel.typeName = "app.LoginViewModel";
    app.LoginViewModel = LoginViewModel;
})(app || (app = {}));
