var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var Login = (function (_super) {
        __extends(Login, _super);
        function Login() {
            _super.call(this);
            this.dataContext = new app.LoginViewModel(this);
            this.initializeComponent();
        }
        Object.defineProperty(Login.prototype, "typeName", {
            get: function () {
                return Login.typeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Login, "PAGE_DEFINITION", {
            get: function () {
                return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Stack Orientation=\"Vertical\" VerticalAlignment=\"Center\" HorizontalAlignment=\"Center\">\n    <TextBlock Text=\"Welcome to Login Page\" Margin=\"8\"/>\n    <TextBox Text=\"{path:username,mode:twoway}\" Placeholder=\"User name (test)\" Margin=\"8\"/>\n    <TextBox Text=\"{path:password,mode:twoway}\" Type=\"password\" Placeholder=\"Password (test)\" Margin=\"8\"/>\n    <Button Text=\"Sign In\" Command=\"{path:loginCommand}\" Margin=\"8,16,8,8\"/>\n</Stack>";
            },
            enumerable: true,
            configurable: true
        });
        Login.prototype.initializeComponent = function () {
            var loader = new layouts.XamlReader();
            this.child = loader.Parse(Login.PAGE_DEFINITION);
        };
        Login.prototype.onNavigate = function (context) {
        };
        Login.typeName = "app.Login";
        return Login;
    }(layouts.controls.Page));
    app.Login = Login;
})(app || (app = {}));
