var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var Page1 = (function (_super) {
        __extends(Page1, _super);
        function Page1() {
            var _this = _super.call(this) || this;
            _this.initializeComponent();
            _this.cachePage = true;
            return _this;
        }
        Object.defineProperty(Page1.prototype, "typeName", {
            get: function () {
                return Page1.typeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Page1, "PAGE_DEFINITION", {
            get: function () {
                return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Stack Orientation=\"Vertical\" VerticalAlignment=\"Center\" HorizontalAlignment=\"Center\">\n    <TextBlock Text=\"{path:username}\" Format=\"Welcome to Page1 user {0}\" Margin=\"8\"/>\n    <TextBox Text=\"{path:parameter,twoway}\" Placeholder=\"Parameter for page 2\" Margin=\"8\"/>\n    <Button Text=\"Goto Page 2\" Command=\"{path:gotoPage2Command}\" Margin=\"8,16,8,8\"/>\n</Stack>";
            },
            enumerable: true,
            configurable: true
        });
        Page1.prototype.initializeComponent = function () {
            var loader = new layouts.XamlReader();
            this.child = loader.Parse(Page1.PAGE_DEFINITION);
        };
        Page1.prototype.onNavigate = function (context) {
            this.dataContext = new app.Page1ViewModel(this, context.queryString["user"]);
        };
        return Page1;
    }(layouts.controls.Page));
    Page1.typeName = "app.Page1";
    app.Page1 = Page1;
})(app || (app = {}));
