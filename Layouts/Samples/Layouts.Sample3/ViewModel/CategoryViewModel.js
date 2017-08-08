var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CategoryViewModel = (function (_super) {
    __extends(CategoryViewModel, _super);
    function CategoryViewModel() {
        _super.apply(this, arguments);
        this._articles = new layouts.ObservableCollection();
        this._isExpanded = false;
    }
    Object.defineProperty(CategoryViewModel.prototype, "typeName", {
        get: function () {
            return CategoryViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryViewModel.prototype, "articles", {
        get: function () {
            return this._articles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryViewModel.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            if (this._title != value) {
                var oldValue = this._title;
                this._title = value;
                this.onPropertyChanged("title", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryViewModel.prototype, "isExpanded", {
        get: function () {
            return this._isExpanded;
        },
        set: function (value) {
            if (this._isExpanded != value) {
                var oldValue = this._isExpanded;
                this._isExpanded = value;
                this.onPropertyChanged("isExpanded", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryViewModel.prototype, "expandCommand", {
        get: function () {
            var _this = this;
            if (this._expandCommand == null)
                this._expandCommand = new layouts.Command(function (cmd, p) { return _this.onToggleExpansion(); }, function (cmd, p) { return true; });
            return this._expandCommand;
        },
        enumerable: true,
        configurable: true
    });
    CategoryViewModel.prototype.onToggleExpansion = function () {
        this.isExpanded = !this.isExpanded;
    };
    Object.defineProperty(CategoryViewModel.prototype, "addArticleCommand", {
        get: function () {
            var _this = this;
            if (this._addArticleCommand == null)
                this._addArticleCommand = new layouts.Command(function (cmd, p) { return _this.onAddArticle(); }, function (cmd, p) { return true; });
            return this._addArticleCommand;
        },
        enumerable: true,
        configurable: true
    });
    CategoryViewModel.prototype.onAddArticle = function () {
        var dlg = new AddArticleDialogView();
        dlg.dataContext = new AddArticleDialogViewModel(dlg, this);
        layouts.LayoutManager.showDialog(dlg);
    };
    CategoryViewModel.typeName = "CategoryViewModel";
    return CategoryViewModel;
})(layouts.DepObject);
