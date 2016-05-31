var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ArticleViewModel = (function (_super) {
    __extends(ArticleViewModel, _super);
    function ArticleViewModel() {
        _super.call(this);
        this._isSelected = false;
    }
    Object.defineProperty(ArticleViewModel.prototype, "typeName", {
        get: function () {
            return ArticleViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArticleViewModel.prototype, "title", {
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
    Object.defineProperty(ArticleViewModel.prototype, "appViewModel", {
        get: function () {
            return layouts.Application.current.page.dataContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArticleViewModel.prototype, "isSelected", {
        get: function () {
            return this._isSelected;
        },
        set: function (value) {
            if (this._isSelected != value) {
                var oldValue = this._isSelected;
                this._isSelected = value;
                this.onPropertyChanged("isSelected", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArticleViewModel.prototype, "url", {
        get: function () {
            return "https://en.wikipedia.org/wiki/" + this.title.replace(/ /g, "_");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArticleViewModel.prototype, "openArticleCommand", {
        get: function () {
            var _this = this;
            if (this._openArticleCommand == null)
                this._openArticleCommand = new layouts.Command(function (cmd, p) { return _this.onOpenArticle(p); }, function (cmd, p) { return true; });
            return this._openArticleCommand;
        },
        enumerable: true,
        configurable: true
    });
    ArticleViewModel.prototype.onOpenArticle = function (article) {
        this.appViewModel.openArticle(this);
    };
    Object.defineProperty(ArticleViewModel.prototype, "closeArticleCommand", {
        get: function () {
            var _this = this;
            if (this._closeArticleCommand == null)
                this._closeArticleCommand = new layouts.Command(function (cmd, p) { return _this.onCloseArticle(p); }, function (cmd, p) { return true; });
            return this._closeArticleCommand;
        },
        enumerable: true,
        configurable: true
    });
    ArticleViewModel.prototype.onCloseArticle = function (article) {
        this.appViewModel.closeArticle(this);
    };
    ArticleViewModel.typeName = "ArticleViewModel";
    return ArticleViewModel;
})(layouts.DepObject);
